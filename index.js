// express
const express = require("express");
const app = express();
const port = 3000;

// key.js => mongodb setting
const config = require("./config/key");

// mongo db mongoose
const mongoose = require("mongoose");
mongoose
  .connect(
    config.mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MONGODB CONNECT..."))
  .catch((err) => console.log(err));

// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// User model
const { User } = require("./models/User");

//route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err, userInfo) => {
    if (err) return res.json({ register: "fail", err });
    return res.status(200).json({ register: "success" });
  });
});

app.listen(port, () => {
  console.log(`EXPRESS SERVER CONNECT...`);
});
