import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import SideVideo from "./Sections/SideVideo"

import axios from "axios";

import { Row, Col, List, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

function VideoDetailPage(props) {
  const [video, setVideo] = useState([]);

  useEffect(() => {
    axios
      .post("/api/video/getVideoDetail", {
        videoId: props.match.params.videoId,
      })
      .then((response) => {
        if (response.data.success) {
            console.log(response.data.video)
          setVideo(response.data.video);
        } else {
          alert("Video Fetch Fail");
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

          <List.Item actions>
            <List.Item.Meta
              avatar={
                video[0]?.writer.image ? (
                  <Avatar src={video[0].writer.image} />
                ) : (
                  <Avatar icon={<UserOutlined />} />
                )
              }
              title={video[0]?.title}
              description={video[0]?.description}
            />
          </List.Item>
        </div>
      </Col>
      <Col lg={6} xs={24}>
        <SideVideo/>
      </Col>
    </Row>
  );
}

export default withRouter(VideoDetailPage);
