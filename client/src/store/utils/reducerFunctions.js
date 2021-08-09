export const addMessageToStore = (state, payload) => {
  const { message, activeConversation, sender } = payload;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      lastReadMessage: -1,
      latestMessageText: message.text,
      latestSender: message.senderId,
      unreadMessages: 1, // * OK
    };
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      let activeConversationId = activeConversation;
      // edge case when you add new convos and it doesn't have an id
      if (!activeConversationId)
        activeConversationId =
          message.senderId === convo.otherUser.id
            ? message.conversationId
            : undefined;

      const unreadMessages =
        activeConversationId === convo.id
          ? 0
          : message.senderId === convo.otherUser.id
          ? convo.unreadMessages + 1
          : convo.unreadMessages;

      const convoCopy = {
        ...convo,
        messages: convo.messages.concat(message),
        latestMessageText: message.text,
        lastReadMessage: convo.lastReadMessage,
        latestSender: message.senderId,
        // * OK
        unreadMessages,
      };

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      const fakeConvo = { otherUser: user, messages: [], unreadMessages: 0 };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

// sets the conversation to read at the client
export const setConvoRead = (state, conversationId, lastReadMessageId) => {
  // sets the lastReadMessageId in the correct conversation

  return state.map((convo) => {
    if (convo.id === conversationId) {
      return { ...convo, lastReadMessage: lastReadMessageId };
    }
    return convo;
  });
};

// resets to 0 the number of unread messages
export const setResetUnreadMessages = (state, conversationId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      return { ...convo, unreadMessages: 0 };
    }
    return convo;
  });
};
