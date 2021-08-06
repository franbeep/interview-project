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

  const unreadMessages = useMemo(() => {
    if (!conversation.unreadMessage) return 0;
    let total = 0;
    if (otherUser.username === "hualing")
      console.log(`START: ${conversation.messages.length}`);

    for (let i = conversation.messages.length - 1; i >= 0; i--) {
      if (conversation.messages[i].senderId === otherUser.id) {
        total += 1;
        continue;
      }
      break;
    }
    if (otherUser.username === "hualing") console.log(`hualing: ${total}`);
    return total;
  }, [conversation, otherUser]);

  return (
    <Box className={classes.root}>
      <StyledBadge badgeContent={unreadMessages} color="primary">
        <Box>
          <Typography className={classes.username}>
            {otherUser.username}
          </Typography>
          <Typography className={classes.previewText}>
            {latestMessageText}
          </Typography>
        </Box>
      </StyledBadge>
    </Box>
  );
};

export default ChatContent;
