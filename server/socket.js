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
    // * needs to check credentials [OK]
    socket.on("go-online", onGoOnline(socket));
    socket.on("new-message", onNewMessage(socket));
    socket.on("logout", onLogout(socket));
    // !Turns offline when closing window, however
    // !it does not work if more than 1 tab is open
    // socket.on("disconnect", async () => {
    //   const { id } = socket.request.user;
    //   await removeOnlineUser(id);
    //   socket.broadcast.emit("remove-offline-user", id);
    // });
  });
};

const onGoOnline = (socket) => async (id) => {
  // * add redis to store this ? [OK]
  await addOnlineUser(id);

  // send the user who just went online to everyone else who is already online
  socket.broadcast.emit("add-online-user", id);
};

const onNewMessage = (socket) => async (data) => {
  // * should emit only to the correct one [OK]
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
  // * again: add redis to store/remove this ? [OK]
  await removeOnlineUser(id);

  socket.broadcast.emit("remove-offline-user", id);
};

module.exports = listenSocket;
