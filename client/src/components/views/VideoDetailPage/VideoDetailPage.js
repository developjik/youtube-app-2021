import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import LikeDislike from "./Sections/LikeDislike";

import axios from "axios";

import { Row, Col, List, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

function VideoDetailPage(props) {
  const [video, setVideo] = useState([]);
  const [comments, setComments] = useState([]);

  const refreshFunction = (newComment) => {
    setComments(comments.concat(newComment))
  }

  useEffect(() => {
    axios
      .post("/api/video/getVideoDetail", {
        videoId: props.match.params.videoId,
      })
      .then((response) => {
        if (response.data.success) {
          setVideo(response.data.video);
        } else {
          alert("Video Fetch Fail");
        }
      });

    axios
      .post("/api/comment/getComments", {
        videoId: props.match.params.videoId,
      })
      .then((response) => {
        if (response.data.success) {
          setComments(response.data.comments);
        } else {
          alert("Comments Fetch Fail");
        }
      });
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col lg={18} xs={24}>
        <div style={{ width: "100%", padding: "3rem 4rem" }}>
          <video
            style={{ width: "100%" }}
            src={`http://localhost:5000/${video[0]?.filePath?.substring(15)}`}
            controls
            autoPlay
          />

          {video[0] !== undefined && (
            <List.Item actions={[<LikeDislike video={video[0]}/>, <Subscribe userTo={video[0].writer._id} />]}>
              <List.Item.Meta
                avatar={
                  video[0]?.writer.image ? (
                    <Avatar src={video[0].writer.image} />
                  ) : (
                    <Avatar icon={<UserOutlined />} />
                  )
                }
                title={video[0].title}
                description={video[0].description}
              />
            </List.Item>
          )}
          <Comment commentLists={comments} refreshFunction={refreshFunction}/>
        </div>
      </Col>
      <Col lg={6} xs={24}>
        <SideVideo />
      </Col>
    </Row>
  );
}

export default withRouter(VideoDetailPage);
