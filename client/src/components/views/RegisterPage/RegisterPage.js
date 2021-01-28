import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";

import { Form, Input, Button, Checkbox } from "antd";

function RegisterPage(props) {
  const layout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 20,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 10,
      span: 20,
    },
  };

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
    // event.preventDefault();

    if (password !== confirmPassword) {
      return alert("Password not same");
    }

    let data = {
      name,
      email,
      password,
    };

    dispatch(registerUser(data)).then((response) => {
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
        height: "90vh",
      }}
    >
      <Form
        {...layout}
        name="register"
        initialValues={{
          remember: true,
        }}
        onFinish={onSubmitHandler}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input
            id="name"
            placeholder="Enter your Name"
            value={name}
            onChange={onNameHandler}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            id="email"
            placeholder="Enter your Email"
            value={email}
            onChange={onEmailHandler}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            id="password"
            placeholder="Enter your Password"
            value={password}
            onChange={onPasswordHandler}
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Please input your Confirm password!",
            },
          ]}
        >
          <Input.Password
            id="confirmPassword"
            placeholder="Enter your ConfirmPassword"
            value={confirmPassword}
            onChange={onConfirmPasswordHandler}
          />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default withRouter(RegisterPage);
