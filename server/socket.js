// const { app, sessionStore } = require("./app");
const { userMiddleware } = require("./middlewares");
const { addOnlineUser, removeOnlineUser } = require("./onlineUsers");
const { Conversation, User } = require("./db/models");
const { Op } = require("sequelize");

const listenSocket = (io) => {
  const wrap = (socket, next) => {
    socket.request.headers["x-access-token"] = socket.handshake.auth.token;
    return userMiddleware(socket.request, null, next);
  };

  // insert a User Model object into the request
  io.use(wrap);

  // seclude the user from messages not directed to them
  io.use((socket, next) => {
    if (!socket.request.user) next(new Error("Invalid User"));
    socket.join(socket.request.user.username);
    next();
  });

  io.on("connection", (socket) => {
    socket.on("go-online", onGoOnline(socket));
    socket.on("read-message", onReadMessage(socket));
    socket.on("new-message", onNewMessage(socket));
    socket.on("logout", onLogout(socket));
  });
};

const onGoOnline = (socket) => async (id) => {
  await addOnlineUser(id);

  // send the user who just went online to everyone else who is already online
  socket.broadcast.emit("add-online-user", id);
};

const onReadMessage = (socket) => async (data) => {
  socket.broadcast.emit("read-message", {
    conversationId: data.conversationId,
    lastReadMessageId: data.lastReadMessageId,
  });
};

const onNewMessage = (socket) => async (data) => {
  const { user } = socket.request;
  const { message, sender } = data;

  // find conversation in order to find the receiver
  const conversation = await Conversation.findOne({
    where: { id: message.conversationId },
    include: [
      {
        model: User,
        as: "user1",
        attributes: ["id", "username"],
        required: true,
      },
      {
        model: User,
        as: "user2",
        attributes: ["id", "username"],
        required: true,
      },
    ],
  });

  if (conversation) {
    // if user1 is the sender, sends to user2
    // otherwise sends to user1
    if (user.username == conversation.user1.username)
      return socket.to(conversation.user2.username).emit("new-message", {
        message: message,
        sender: sender,
      });
    socket.to(conversation.user1.username).emit("new-message", {
      message: message,
      sender: sender,
    });
  }
};

const onLogout = (socket) => async (id) => {
  await removeOnlineUser(id);

  socket.broadcast.emit("remove-offline-user", id);
};

module.exports = listenSocket;
