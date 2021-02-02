import React, { useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Dropzone from "react-dropzone";

import axios from "axios";

import { PlusOutlined } from "@ant-design/icons";
import { Typography, Button, Form, message, Input } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

const Priavte = [
  {
    value: 0,
    label: "Private",
  },
  {
    value: 1,
    label: "Public",
  },
];

const Category = [
  {
    value: 0,
    label: "Film & Animation",
  },
  {
    value: 1,
    label: "Autos & Vehicles",
  },
  {
    value: 2,
    label: "Music",
  },
  {
    value: 3,
    label: "Pets & Animals",
  },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user);

  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [privateOrPublic, setPrivateOrPublic] = useState(0);
  const [category, setCategory] = useState("Film & Animation");
  const [filePath, setFilePath] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [duration, setDuration] = useState(0);

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        setFilePath(response.data.url);

        axios
          .post("/api/video/thumbnail", {
            url: response.data.url,
            fileName: response.data.fileName,
          })
          .then((response) => {
            if (response.data.success) {
              setThumbnailPath(response.data.url);
              setDuration(response.data.fileDuration);
            } else {
              alert("Thumbnail Create Fail...");
            }
          });
      } else {
        alert("Video Upload Fail...");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      writer: user.userData._id,
      title: videoTitle,
      description: videoDescription,
      privacy: privateOrPublic,
      filePath,
      category,
      duration,
      thumbnail: thumbnailPath,
    };

    axios.post("/api/video/uploadVideo", data).then((response) => {
      if (response.data.success) {
        message.success("Video Upload Success");
        setTimeout(() => {
          props.history.push("/");
        }, 1500);
      } else {
        alert("Video Upload Fail...");
      }
    });
  };

  return (
    <div style={{ maxWidth: "80vw", margin: "2rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <Title>Upload Video</Title>
      </div>
      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "30vw",
                  height: "25vh",
                  border: "1px solid black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "7rem",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <PlusOutlined />
              </div>
            )}
          </Dropzone>
          <div>
            {thumbnailPath && (
              <img
                src={`http://localhost:5000/${thumbnailPath}`}
                alt="thumbnail"
              />
            )}
          </div>
        </div>
        <br />
        <br />
        <Title level={3}>Title: </Title>
        <Input
          onChange={(e) => {
            setVideoTitle(e.currentTarget.value);
          }}
          value={videoTitle}
        />
        <br />
        <br />
        <Title level={3}>Description: </Title>
        <TextArea
          onChange={(e) => {
            setVideoDescription(e.currentTarget.value);
          }}
          value={videoDescription}
        />
        <br />
        <br />
        <select
          onChange={(e) => {
            setPrivateOrPublic(e.currentTarget.value);
          }}
        >
          {Priavte.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select
          onChange={(e) => {
            setCategory(e.currentTarget.value);
          }}
        >
          {Category.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(VideoUploadPage);
