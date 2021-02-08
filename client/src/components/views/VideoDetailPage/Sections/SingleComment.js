import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import axios from "axios";

import LikeDislike from "./LikeDislike";

import { Comment, Avatar, Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function SingleComment(props) {
  const [openReply, setOpenReply] = useState(false);
  const [commentValue, setCommentValue] = useState("");

  const actions = [<LikeDislike commentId={props.comment._id}/>,
    <span
      onClick={() => {
        setOpenReply(!openReply);
      }}
      key="comment-basic-reply-to"
    >
      Reply to
    </span>,
  ];

  const onSubmit = (event) => {
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: localStorage.getItem("userId"),
      postId: props.match.params.videoId,
      responseTo: props.comment._id,
    };

    axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        setCommentValue("");
        setOpenReply(false);
        props.refreshFunction(response.data.result);
      } else {
        alert("Comment Upload Fail");
      }
    });
  };

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={
          props.comment.writer.image ? (
            <Avatar src={props.comment.writer.image} />
          ) : (
            <Avatar icon={<UserOutlined />} />
          )
        }
        alt="No Image"
        content={<p>{props.comment.content}</p>}
      />

      {openReply && (
        <form style={{ display: "flex", marginBottom: "10px" }} onSubmit={onSubmit}>
          <TextArea
            rows={2}
            style={{ width: "100%", borderRadius: "8px" }}
            onChange={(event) => {
              setCommentValue(event.currentTarget.value);
            }}
            value={commentValue}
            placeholder="comment please..."
          />
          <br />
          <Button
            style={{
              width: "20%",
              marginLeft: "1vw",
              borderRadius: "8px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default withRouter(SingleComment);
