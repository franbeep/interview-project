const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (conversation) => {
  return {
    type: SET_ACTIVE_CHAT,
    conversation,
  };
};

const initialState = {
  id: -1,
  otherUser: { id: -1, username: null },
  lastReadMessage: -1,
  unreadMessages: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return action.conversation;
    }
    default:
      return state;
  }
};

export default reducer;
