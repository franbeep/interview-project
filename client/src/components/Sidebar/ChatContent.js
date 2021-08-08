import React, { useMemo } from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  boldText: {
    fontWeight: "bold",
    color: theme.palette.common.black,
  },
}));

const StyledBadge = withStyles((theme) => ({
  root: {
    width: "100%",
  },
  badge: {
    top: 20,
    right: 30,
    fontWeight: "bold",
  },
}))(Badge);

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  // saves the number of unread messages of the conversation
  const unreadMessages = useMemo(() => {
    let total = 0;
    for (let i = conversation.messages.length - 1; i >= 0; i--) {
      if (
        conversation.messages[i].senderId === otherUser.id &&
        conversation.messages[i].id > conversation.lastReadMessage
      ) {
        total += 1;
        continue;
      }
      break;
    }
    return total;
  }, [conversation, otherUser]);

  return (
    <Box className={classes.root}>
      <StyledBadge badgeContent={unreadMessages} color="primary">
        <Box>
          <Typography className={classes.username}>
            {otherUser.username}
          </Typography>
          <Typography
            className={`${classes.previewText} ${
              unreadMessages && classes.boldText
            }`}
          >
            {latestMessageText}
          </Typography>
        </Box>
      </StyledBadge>
    </Box>
  );
};

export default ChatContent;
