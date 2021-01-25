// MONGO DB
const mongoose = require("mongoose");

// password encrypt
const bcrypt = require("bcrypt");
const saltRounds = 10; // encrypt text number

// jsonwebtoken (for token generate)
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// 사용자 입력 비밀번호, DB 비밀번호 비교하는 메소드
userSchema.methods.comparePassword = function (plainPassword, cb) {
  let user = this;
  bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// jsonwebtoken을 이용하요 token 생성하는 메소드
userSchema.methods.generateToken = function (cb) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secretToken"); // token = user._id + 'secretToken'
  user.token = token;

  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// client cookie를 decode하고 검사하기
userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  // decode
  jwt.verify(token, "secretToken", function (err, decoded) {
    // decoded는 user의 _id 값
    // uder _id, token 값으로 db에서 찾기
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

userSchema.pre("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash; // hash된 비밀번호로 교채
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
