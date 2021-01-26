import React from "react";
import { Link, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

import { Menu } from "antd";

function NavBar(props) {
  const redux = useSelector((state) => state.user);

  const onLogoutHandler = () => {
    axios.get("api/users/logout").then((response) => {
      if (response.data.logout) {
        props.history.push("/login");
      } else {
        alert("logout fail");
      }
    });
  };

  return (
    <nav>
      <Link
        to="/"
        style={{
          float: "left",
          width: "10vw",
          display: "flex",
          justifyContent: "center",
          height: "7vh",
          fontSize: "2rem",
        }}
      >
        Logo
      </Link>
      {redux === null || !redux.userData.isAuth ? (
        <Menu mode="horizontal">
          <Menu.Item key="Home">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="login" style={{ float: "right" }}>
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="register" style={{ float: "right" }}>
            <Link to="/register">Register</Link>
          </Menu.Item>
        </Menu>
      ) : (
        <Menu mode="horizontal">
          <Menu.Item key="Home">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item
            key="logout"
            onClick={onLogoutHandler}
            style={{ float: "right" }}
          >
            Logout
          </Menu.Item>
        </Menu>
      )}
    </nav>
  );
}

export default withRouter(NavBar);
