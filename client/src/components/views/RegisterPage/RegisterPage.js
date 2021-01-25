import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmpassword(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return alert("Password not same");
    }

    let data = {
      name,
      email,
      password,
    };

    dispatch(registerUser(data)).then((response) => {
      console.log(response);
      if (response.payload.register) {
        props.history.push("/login");
      } else {
        alert("Fail to sign up");
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
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email: </label>
        <input type="email" value={email} onChange={onEmailHandler} />
        <label>Name: </label>
        <input type="text" value={name} onChange={onNameHandler} />
        <label>Password: </label>
        <input type="password" value={password} onChange={onPasswordHandler} />
        <label>Confirm Password: </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={onConfirmPasswordHandler}
        />
        <br />
        <button>Register</button>
      </form>
    </div>
  );
}

export default withRouter(RegisterPage);
