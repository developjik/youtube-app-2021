import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { auth } from "../_actions/user_action";

export default function (Component, option, adminRoute = null) {
  // option 1. null => 아무나 출입 가능 2. true => 로그인한 유저만 출입 가능 3. false => 로그인한 유저는 출입 불가능
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        if (!response.payload.isAuth) {
          // no login
          if (option) {
            props.history.push("/login");
          }
        } else {
          // login
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          }
          if (option === false) {
            props.history.push("/");
          }
        }
      });
    }, []);

    return <Component />;
  }

  return AuthenticationCheck;
}
