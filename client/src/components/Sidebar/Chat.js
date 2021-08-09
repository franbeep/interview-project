import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import {
  readConversation,
  resetUnreadMessages,
} from "../../store/conversations";
import { sendConversationRead } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const styles = {
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
};

class Chat extends Component {
  handleClick = async (conversation) => {
    await this.props.setActiveChat(conversation);
    // if you're not the one that sent the last message
    // and its an empty chat, set the messages to read

    if (conversation.unreadMessages > 0) {
      // sends to the backend that you read the message
      await sendConversationRead(
        conversation.id,
        conversation.messages[conversation.messages.length - 1].id
      );
      await this.props.setConvoRead(conversation.id);
      await this.props.resetUnreadMessages(conversation.id);
    }
  };

  render() {
    const { classes } = this.props;
    const otherUser = this.props.conversation.otherUser;
    return (
      <Box
        onClick={() => this.handleClick(this.props.conversation)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={this.props.conversation} />
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (convo) => {
      dispatch(setActiveChat(convo));
    },
    setConvoRead: (convoId) => {
      dispatch(readConversation(convoId));
    },
    resetUnreadMessages: (convoId) => {
      dispatch(resetUnreadMessages(convoId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Chat));
