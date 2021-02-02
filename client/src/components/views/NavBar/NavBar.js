import React from "react";
import { Link, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

import { Menu } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";

function NavBar(props) {
  const redux = useSelector((state) => state.user);
  // console.log(redux)

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
          color: "red",
          width: "10vw",
          display: "flex",
          justifyContent: "center",
          height: "7vh",
          fontSize: "2rem",
        }}
      >
        YOUTUBE
      </Link>
      {redux === null || !redux.userData.isAuth ? (
        <Menu mode="horizontal">
          <Menu.Item key="Home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item
            key="login"
            icon={<LoginOutlined />}
            style={{ float: "right" }}
          >
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item
            key="register"
            icon={<PlusOutlined />}
            style={{ float: "right" }}
          >
            <Link to="/register">Register</Link>
          </Menu.Item>
        </Menu>
      ) : (
        <Menu mode="horizontal">
          <Menu.Item key="Home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={onLogoutHandler}
            style={{ float: "right" }}
          >
            Logout
          </Menu.Item>
          <Menu.Item
            key="Upload"
            icon={<UploadOutlined />}
            style={{ float: "right" }}
          >
            <Link to="/video/upload">Upload</Link>
          </Menu.Item>
          <Menu.Item
            key="user"
            icon={<UserOutlined />}
            disabled
            style={{ float: "right" }}
          >
            {redux.userData.name}님
          </Menu.Item>
        </Menu>
      )}
    </nav>
  );
}

export default withRouter(NavBar);
