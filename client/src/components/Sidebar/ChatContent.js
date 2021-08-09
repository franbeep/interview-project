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
  const { latestMessageText, otherUser, unreadMessages } = conversation;

  return (
    <Box className={classes.root}>
      <StyledBadge badgeContent={unreadMessages} color="primary">
        <Box>
          <Typography className={classes.username}>
            {otherUser.username}
          </Typography>
          <Typography
            className={`${classes.previewText} ${
              unreadMessages > 0 && classes.boldText
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
