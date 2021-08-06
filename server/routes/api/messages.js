const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    let conversation = await Conversation.findOne({
      where: { id: conversationId },
    });

    // ascertains if the user is part of the conversation
    if (conversation) {
      if (
        conversation.user1Id !== senderId &&
        conversation.user2Id !== senderId
      ) {
        return res.sendStatus(403);
      }
      // if we already know conversation id is valid, we can save time
      // and just add it to message and return
      await Conversation.update(
        { unreadMessage: true },
        { where: { id: conversation.id } }
      );
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }

    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    conversation = await Conversation.findConversation(senderId, recipientId);

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    await Conversation.update(
      { unreadMessage: true },
      { where: { id: conversation.id } }
    );
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
