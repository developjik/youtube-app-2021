import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import SingleComment from "./SingleComment";

import axios from "axios";

function ReplyComment(props) {
  const [replyCommentNumber, setReplyCommentNumber] = useState(0);
  const [openReply, setOpenReply] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentLists.map((comment, index) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });

    setReplyCommentNumber(commentNumber);
  }, [props.commentLists]);

  let renderReplyComment = () => 
    props.commentLists.map((comment, index) => (
      <>
        {comment.responseTo === props.parentCommentId && (
          <div key={index} style={{width: '80%', marginLeft: '40px'}}>
            <SingleComment
              comment={comment}
              refreshFunction={props.refreshFunction}
            />
            <ReplyComment
              commentLists={props.commentLists}
              parentCommentId={comment._id}
              refreshFunction={props.refreshFunction}
            />
          </div>
        )}
      </>
    ));

  return (
    <div>
      {replyCommentNumber > 0 && (
        <p
          style={{ fontSize: "14px", margin: 0, color: "gray" }}
          onClick={() => {
            setOpenReply(!openReply);
          }}
        >
          View {replyCommentNumber} more comment(s)         
        </p>        
      )}
       { openReply && renderReplyComment()}
    </div>
  );
}

export default withRouter(ReplyComment);
