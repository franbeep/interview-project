import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    "borderRadius": 8,
    "height": 80,
    "boxShadow": "0 2px 10px 0 rgba(88,133,196,0.05)",
    "marginBottom": 10,
    "display": "flex",
    "alignItems": "center",
    "&:hover": {
      cursor: "grab",
    },
  },
}));

const Chat = ({ conversation }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { otherUser } = conversation;

  const handleClick = (conversation) => {
    // TODO: Will be changing after PR #3 gets merged
    dispatch(setActiveChat(conversation.otherUser.username));
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  );
};

export default Chat;
