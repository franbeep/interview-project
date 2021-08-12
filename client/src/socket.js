import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  readConversation,
} from "./store/conversations";
import { sendConversationRead } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", async (data) => {
    const { activeConversation } = store.getState();

    // if you received a message in the actual conversation
    if (activeConversation.otherUser.id === data.message.senderId)
      await store.dispatch(
        sendConversationRead(data.message.conversationId, data.message.id)
      );

    store.dispatch(
      setNewMessage(data.message, activeConversation, data.sender)
    );
  });
  socket.on("read-message", (data) => {
    const { conversationId, lastReadMessageId } = data;
    store.dispatch(readConversation(conversationId, lastReadMessageId));
  });
});

export default socket;
