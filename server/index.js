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

// auth
const { auth } = require("./middleware/auth");

// User model
const { User } = require("./models/User");

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

app.listen(port, () => {
  console.log(`EXPRESS SERVER CONNECT...`);
});
