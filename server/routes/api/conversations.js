const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const { isUserOnline } = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id", "lastReadMessage"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      convoJSON.otherUser.online = await isUserOnline(convoJSON.otherUser.id);

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      convoJSON.latestSender = convoJSON.messages[0].senderId;

      let lastReadMessage = -1;
      let unreadMessages = 0;

      for (let i = 0; i < convoJSON.messages.length; i++) {
        // calculates unreadMessages number
        if (
          convoJSON.messages[i].senderId !== userId &&
          convoJSON.messages[i].id > convoJSON.lastReadMessage
        ) {
          unreadMessages += 1;
        }

        // calculates exact lastReadMessage based on saved one
        if (convoJSON.messages[i].senderId === userId) {
          if (convoJSON.messages[i].id > convoJSON.lastReadMessage) {
            break;
          }
          lastReadMessage = convoJSON.messages[i].id;
          break;
        }
      }

      convoJSON.lastReadMessage = lastReadMessage;
      convoJSON.unreadMessages = unreadMessages;

      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// endpoint to set conversation to read till
// the message appointed by lastReadMessageId
router.patch("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { conversationId, lastReadMessageId } = req.body;

    const message = await Message.findOne({
      where: { id: lastReadMessageId },
    });

    // message not found
    if (!message) res.sendStatus(404);

    // if message is not part of the conversation, or the user is the message sender
    if (
      message.conversationId !== conversationId ||
      message.senderId === req.user.id
    )
      return res.sendStatus(403);

    const conversation = await Conversation.update(
      { lastReadMessage: lastReadMessageId },
      {
        where: {
          id: conversationId,
          [Op.or]: {
            user1Id: req.user.id,
            user2Id: req.user.id,
          },
        },
      }
    );

    // if the user is not part of the conversation sends 403 too
    if (!conversation) return res.sendStatus(403);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
