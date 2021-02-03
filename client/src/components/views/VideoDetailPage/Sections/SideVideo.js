import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import axios from "axios";

import { Row, Col, List, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
function SideVideo(props) {
  const [sideVideos, setSideVideos] = useState([]);
  const [videoId, setVideoId] = useState(props.match.params.videoId);

  const renderSideVideo = sideVideos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{ display: "flex", margin: "1rem", padding: "0 2rem" }}
      >
        <div style={{ width: "40%", marginBottom: "1rem" }}>
          <a href={`/video/${video._id}`} replace>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="No Image"
            />
          </a>
        </div>
        <div style={{ width: "50%" }}>
          <a href={`/video/${video._id}`} style={{ color: "gray" }}>
            <div style={{ paddingLeft: "0.3rem" }}>
              <span style={{ fontSize: "1rem" }}>{video.title}</span>
              <br />
              <span>{video.writer.name}</span> <br />
              <span>{video.views} views</span>
              <br />
              <span>
                {minutes >= 10 ? minutes : `0${minutes}`} :{" "}
                {seconds >= 10 ? seconds : `0${minutes}`}{" "}
              </span>
            </div>
          </a>
        </div>
      </div>
    );
  });

  useEffect(() => {
    axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        alert("Side Video Fetch Fail");
      }
    });
  }, []);

  return <div>{renderSideVideo}</div>;
}

export default withRouter(SideVideo);
