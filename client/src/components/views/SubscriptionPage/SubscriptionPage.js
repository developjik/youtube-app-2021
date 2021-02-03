import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";

import moment from "moment";
import axios from "axios";

import { Card, Avatar, Col, Row, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage(props) {
  const [videos, setVideos] = useState([]);

  const renderVideoCards = videos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Link to={`/video/${video._id}`}>
          <div style={{ position: "relative" }}>
            <img
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="NO ThumbNail"
              style={{ width: "100%" }}
            />
            <div
              style={{
                bottom: 0,
                right: 0,
                position: "absolute",
                margin: "4px",
                color: "white",
              }}
            >
              {minutes >= 10 ? minutes : `0${minutes}`} :{" "}
              {seconds >= 10 ? seconds : `0${minutes}`}{" "}
            </div>
          </div>
        </Link>
        <br />
        <Meta
          avatar={
            video.writer.image ? (
              <Avatar src={video.writer.image} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )
          }
          title={video.title}
          description=""
        />
        <span style={{ fontSize: "0.6rem" }}>{video.writer.name}</span>
        <br />
        <span style={{ fontSize: "0.8rem" }}>{video.views} views</span> -{" "}
        <span style={{ fontSize: "0.8rem" }}>
          {moment(video.createdAt).format("MMM Do YY")}
        </span>
      </Col>
    );
  });

  useEffect(() => {
    axios.post("/api/video/getSubscriptionVideos",{ userFrom: localStorage.getItem("userId"), }).then((response) => {
      if (response.data.success) {
        setVideos(response.data.videos);
      } else {
        alert("Video Fetch Fail");
      }
    });
  }, []);

  return (
    <div
      style={{
        margin: "3rem auto",
        width: "85%",
      }}
    >
      <Title levle={2}>Recommended</Title>
      <hr />
      <Row gutter={[32, 16]}>{renderVideoCards}</Row>
    </div>
  );
}

export default withRouter(SubscriptionPage);
