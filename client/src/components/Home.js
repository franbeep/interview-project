import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "97vh",
  },
}));

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn) {
      if (user.id) {
        setIsLoggedIn(true);
        return;
      }
      history.push("/register");
      return;
    }
    if (!user.id) {
      // logout
      setIsLoggedIn(false);
      history.push("/login");
    }
  }, [user, history, isLoggedIn]);

  useEffect(() => {
    dispatch(fetchConversations());
  });

  const handleLogout = async () => {
    dispatch(logout(user.id));
    dispatch(clearOnLogout());
  };

  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
  );
};

export default Home;
