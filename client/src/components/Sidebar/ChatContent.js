import React from "react";
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
  boldPreviewText: {
    fontSize: 12,
    color: theme.palette.common.black,
    letterSpacing: -0.17,
    fontWeight: "bold",
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

const ChatContent = ({ conversation }) => {
  const classes = useStyles();

  const { latestMessageText, otherUser, unreadMessages } = conversation;

  return (
    <Box className={classes.root}>
      <StyledBadge badgeContent={unreadMessages} color="primary">
        <Box>
          <Typography className={classes.username}>
            {otherUser.username}
          </Typography>
          <Typography
            className={
              unreadMessages > 0 ? classes.boldPreviewText : classes.previewText
            }
          >
            {latestMessageText}
          </Typography>
        </Box>
      </StyledBadge>
    </Box>
  );
};

export default ChatContent;
