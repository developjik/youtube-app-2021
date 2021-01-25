import axios from "axios";
import React from "react";
import { withRouter } from "react-router-dom";

function LandingPage(props) {
  const onClickHandler = () => {
    axios.get("api/users/logout").then((response) => {
      if (response.data.logout) {
        props.history.push("/login");
      } else {
        alert("logout fail");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      Home
      <button onClick={onClickHandler}>LogOut</button>
    </div>
  );
}

export default withRouter(LandingPage);
