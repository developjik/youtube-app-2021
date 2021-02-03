import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import axios from "axios";

import { Button } from "antd";

function Subscribe(props) {
  const [subscriberNumber, setSubscriberNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = () => {
    if (subscribed) {
      axios
        .post("/api/subscribe/unSubscribe", {
          userTo: props.userTo,
          userFrom: localStorage.getItem("userId"),
        })
        .then((response) => {
          if (response.data.success) {
            setSubscriberNumber(subscriberNumber - 1);
            setSubscribed(!subscribed);
          } else {
            alert("Unsubscribe Info Fetch Fail");
          }
        });
    } else {
      axios
        .post("/api/subscribe/subscribe", {
          userTo: props.userTo,
          userFrom: localStorage.getItem("userId"),
        })
        .then((response) => {
          if (response.data.success) {
            setSubscriberNumber(subscriberNumber + 1);
            setSubscribed(!subscribed);
          } else {
            alert("Subscribe Info Fetch Fail");
          }
        });
    }
  };

  useEffect(() => {
    console.log(props.userTo)
    axios
      .post("/api/subscribe/subscribeNumber", {
        userTo: props.userTo,
      })
      .then((response) => {
        if (response.data.success) {
          setSubscriberNumber(response.data.subscribeNumber);
        } else {
          alert("Subscriber Number Fetch Fail");
        }
      });

    axios
      .post("/api/subscribe/subscribed", {
        userTo: props.userTo,
        userFrom: localStorage.getItem("userId"),
      })
      .then((response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert("Subscribed Information Fetch Fail");
        }
      });
  }, []);

  return (
    <Button
      style={{
        backgroundColor: `${subscribed ? "#AAAAAA" : "#CC0000"}`,
        borderRadius: "1rem",
        color: "white",
      }}
      onClick={onSubscribe}
    >
      {subscriberNumber} {subscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
}

export default withRouter(Subscribe);
