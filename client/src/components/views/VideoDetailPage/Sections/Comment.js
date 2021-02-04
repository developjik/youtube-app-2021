import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import axios from "axios";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

import { Button, Input } from "antd";

const { TextArea } = Input;

function Comment(props) {
  const [commentValue, setCommentValue] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: localStorage.getItem("userId"),
      postId: props.match.params.videoId,
    };

    axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        props.refreshFunction(response.data.result);
        setCommentValue("");
      } else {
        alert("Comment Upload Fail");
      }
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />
      {/* comment list */}
      {props.commentLists?.map(
        (comment, index) =>
          !comment.responseTo && (
            <>
              <SingleComment
                comment={comment}
                refreshFunction={props.refreshFunction}
              />
              <ReplyComment
                commentLists={props.commentLists}
                parentCommentId={comment._id}
                refreshFunction={props.refreshFunction}
              />
            </>
          )
      )}

      {/* reply comment */}
      <form style={{ display: "flex" }} onSubmit>
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
    </div>
  );
}

export default withRouter(Comment);
