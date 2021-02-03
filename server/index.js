// express
const express = require("express");
const app = express();
const port = 5000;

// key.js => mongodb setting
const config = require("./config/key");

// mongo db mongoose
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MONGODB CONNECT..."))
  .catch((err) => console.log(err));

// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// thumbnails static folder
app.use(express.static(__dirname + "/uploads/"));
app.use(express.static(__dirname + "/uploads/thumbnails"));

// multer
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./server/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // only mp4 format ok
    if (ext !== ".mp4") {
      return cb(res.status(400).end("now allowed file"), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

// ffmpeg
const ffmpeg = require("fluent-ffmpeg");

// auth
const { auth } = require("./middleware/auth");

// User Model + Video Model + Subscriber Model
const { User } = require("./models/User");
const { Video } = require("./models/Video");
const { Subscriber } = require("./models/Subscriber");

//route
app.get("/", (req, res) => {
  res.send("Hello World...");
});

app.post("/api/users/register", (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err, userInfo) => {
    if (err) return res.json({ register: "fail", err });
    return res.status(200).json({ register: "success" });
  });
});

app.post("/api/users/login", (req, res) => {
  // email 확인
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 일치하는 유저가 없습니다.",
      });
    }

    // password 확인
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }
    });

    // password 일치하므로 token 생성하기
    userInfo.generateToken((err, userInfo) => {
      if (err) return res.status(400).send(err);

      // user에 token이 이미 생성되어 저장되어 있는 상태
      // token을 client쪽에 저장하기 (ex) cookie, local storage, session storage)
      res.cookie("x_auth", userInfo.token).status(200).json({
        loginSuccess: true,
        userId: userInfo._id,
        message: "Login Success ...",
      });
    });
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  // user의 auth가 확인되어 token의 초기화가 필요한 경우
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ logout: false });
    return res.status(200).send({ logout: true });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // auth middleware 통과 된 것
  return res.status(200).json({
    isAuth: true,
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image,
  });
});

// Video Upload Router
app.post("/api/video/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

//Thumbnail Create Router
app.post("/api/video/thumbnail", (req, res) => {
  let fileDuration = "";
  let filePath = "";

  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.url)
    .on("filenames", function (filenames) {
      filePath = filenames[0];
    })
    .on("end", function () {
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      return res.json({ success: false, err });
    })
    .screenshot({
      count: 3,
      folder: "./server/uploads/thumbnails",
      size: "320x240",
      filename: "thumbnail-%b.png",
    });
});

app.post("/api/video/uploadVideo", (req, res) => {
  const video = new Video(req.body);
  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

app.post("/api/video/getVideoDetail", (req, res) => {
  // populate를 해줘야지 writer의 정보를 얻어오기 가능, populate X 할 경우 writer의 id만 가져온다
  Video.find({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, video) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, video });
    });
});

app.get("/api/video/getVideos", (req, res) => {
  // populate를 해줘야지 writer의 정보를 얻어오기 가능, populate X 할 경우 writer의 id만 가져온다
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

app.post("/api/video/getSubscriptionVideos", (req, res) => {
  let subscribedUser = [];

  // 구독 중인 업로더 찾기
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscribeInfo) => {
      if (err) return res.status(400).send(err);

      subscribeInfo.map((subscriber, i) => {
        subscribedUser.push(subscriber.userTo);
      });

      // 업로더 정보 통해 동영상 찾기
      Video.find({ writer: { $in: subscribedUser } })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          return res.status(200).json({ success: true, videos });
        });
    }
  );
});

// Subscribe route
app.post("/api/subscribe/subscribeNumber", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res
      .status(200)
      .json({ success: true, subscribeNumber: subscribe.length });
  });
});

app.post("/api/subscribe/subscribed", (req, res) => {
  Subscriber.find({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    if (subscribe.length !== 0) {
      return res.status(200).json({ success: true, subscribed: true });
    } else {
      return res.status(200).json({ success: true, subscribed: false });
    }
  });
});

app.post("/api/subscribe/unSubscribe", (req, res) => {
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, doc });
  });
});

app.post("/api/subscribe/subscribe", (req, res) => {
  const subscribe = new Subscriber(req.body);

  subscribe.save((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`EXPRESS SERVER CONNECT...`);
});
