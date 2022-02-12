const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../../config/secrets").secretOrKey;
const User = require("../../models/User");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const router = express.Router();

// @route  GET api/auth/test
// @desc   tests auth route
// @access public
router.get("/test", (_, res) => {
  res.status(200).json({ msg: "auth" });
});

// @route  POST api/auth/register
// @desc   register a new user
// @access public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      return res.status(400).json({ username: "username already exists" });
    } else {
      const newUser = new User({
        username: req.body.username,
      });

      //hash the pass
      bcrypt.genSalt((err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
          if (err) throw err;
          newUser.password = hashedPassword;
          //save the new user in DB
          newUser
            .save()
            .then((user) => res.status(201).json(user))
            .catch((err) => console.error(err));
        });
      });
    }
  });
});

// @route  POST api/auth/login
// @desc   log in an user / return a JWT token
// @access public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  //find user by username
  User.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      return res.status(400).json({ username: "username not found" });
    } else {
      bcrypt.compare(req.body.password, user.password).then((matched) => {
        if (matched) {
          const payload = { id: user.id, username: user.username };
          jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token: token });
          });
        } else {
          res.status(400).json({ password: "wrong password" });
        }
      });
    }
  });
});

module.exports = router;
