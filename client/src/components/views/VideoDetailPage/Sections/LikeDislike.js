import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import axios from "axios";

import { Tooltip } from "antd";
import {
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
} from "@ant-design/icons";

function LikeDislike(props) {
  let data = {};

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [myLike, setMyLike] = useState(null);
  const [myDislike, setMyDislike] = useState(null);

  const onLike = () => {
    if (myLike === null) {
      axios.post("/api/like/upLike", data).then((response) => {
        if (response.data.success) {
          setLikes(likes + 1);
          setMyLike("liked");

          if (myDislike !== null) {
            setMyDislike(null);
            setDislikes(dislikes - 1);
          }
        } else {
          alert("Like Up Fail");
        }
      });
    } else {
      axios.post("/api/like/unLike", data).then((response) => {
        if (response.data.success) {
          setLikes(likes - 1);
          setMyLike(null);
        } else {
          alert("Like down Fail");
        }
      });
    }
  };

  const onDislike = () => {
    if (myDislike === null) {
      axios.post("/api/like/upDislike", data).then((response) => {
        if (response.data.success) {
          setDislikes(dislikes + 1);
          setMyDislike("disliked");

          if (myLike !== null) {
            setMyLike(null);
            setLikes(likes - 1);
          }
        } else {
          alert("Dislike Up Fail");
        }
      });
    } else {
      axios.post("/api/like/unDislike", data).then((response) => {
        if (response.data.success) {
          setDislikes(dislikes - 1);
          setMyDislike(null);
        } else {
          alert("Dislike down Fail");
        }
      });
    }
  };

  if (props.video) {
    data = {
      videoId: props.match.params.videoId,
      userId: localStorage.getItem("userId"),
    };
  } else {
    data = {
      userId: props.commentId,
      userId: localStorage.getItem("userId"),
    };
  }

  useEffect(() => {
    axios.post("/api/like/getLikes", data).then((response) => {
      if (response.data.success) {
        setLikes(response.data.likes.length);
        response.data.likes.map((like, index) => {
          if (like.userId === localStorage.getItem("userId")) {
            setMyLike("liked");
          }
        });
      } else {
        alert("Likes Info Fetch Fail");
      }
    });

    axios.post("/api/like/getDislikes", data).then((response) => {
      if (response.data.success) {
        setDislikes(response.data.dislikes.length);
        response.data.dislikes.map((dislike, index) => {
          if (dislike.userId === localStorage.getItem("userId")) {
            setMyDislike("disliked");
          }
        });
      } else {
        alert("Dislikes Info Fetch Fail");
      }
    });
  }, []);

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <span onClick={onLike}>
            {myLike === "liked" ? <LikeFilled /> : <LikeOutlined />}
          </span>
        </Tooltip>
      </span>
      <span
        style={{ paddingLeft: "5px", paddingRight: "10px", cursor: "auto" }}
      >
        {likes}
      </span>{" "}
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <span onClick={onDislike}>
            {myDislike === "disliked" ? <DislikeFilled /> : <DislikeOutlined />}
          </span>
        </Tooltip>
      </span>
      <span
        style={{ paddingLeft: "5px", paddingRight: "10px", cursor: "auto" }}
      >
        {dislikes}
      </span>
    </div>
  );
}

export default withRouter(LikeDislike);
