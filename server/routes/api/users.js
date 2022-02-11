const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const isEmpty = require("../../validation/isEmpty");

const router = express.Router();

// @route  GET api/users
// @desc   get all users
// @access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find()
      .then((response) => {
        const users = response.map((user) => ({
          id: user.id,
          username: user.username,
        }));
        res.status(200).json(users);
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route  GET api/users/id/userId
// @desc   get user from id
// @access private
router.get(
  "/id/:userId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.params.userId)
      .then((response) =>
        res.status(200).json({
          id: response.id,
          username: response.username,
        })
      )
      .catch((err) => res.status(400).json(err));
  }
);

// @route  GET api/users/name/:username
// @desc   get user from username
// @access private
router.get(
  "/name/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ username: req.params.username })
      .then((response) =>
        res.status(200).json({
          id: response.id,
          username: response.username,
        })
      )
      .catch((err) => res.status(400).json(err));
  }
);

// @route  DELETE api/users/id/userId
// @desc   delete user by id
// @access private
router.delete(
  "/id/:userId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //decoding the currently logged it users data
    const jwtData = jwt.decode(req.headers.authorization.split(" ")[1]);

    //check if current user is deleting themself (they cant delete others duh!)
    if (jwtData.id === req.params.userId) {
      //delete user
      User.findByIdAndDelete(req.params.userId)
        .then(() => res.status(200).json({ success: true }))
        .catch(() =>
          res.status(502).json({ error: "could not delete the user" })
        );
    } else {
      //cant delete other user!
      res.status(401).json({ error: "unauthorized" });
    }
  }
);

// @route  PUT api/users/id/userId
// @desc   update user by id
// @access private
router.put(
  "/id/:userId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //decoding the currently logged it users data
    const jwtData = jwt.decode(req.headers.authorization.split(" ")[1]);

    //check if current user is updating themself (they cant update others duh!)
    if (jwtData.id === req.params.userId) {
      if (req.body.username) {
        //check if username is unique
        User.findOne({ username: req.body.username }).then((user) => {
          if (user) {
            //not unique!
            res.status(400).json({ username: "username already exists" });
          } else {
            const updatedData = {
              username: req.body.username,
            };
            //update the user in DB
            User.findByIdAndUpdate(req.params.userId, updatedData)
              .then(() => res.status(200).json({ success: true }))
              .catch(() =>
                res.status(502).json({ error: "could not update the user" })
              );
          }
        });
      } else {
        res.status(400).json({ error: "nothing to update" });
      }
    } else {
      res.status(401).json({ error: "unauthorized" });
    }
  }
);

module.exports = router;
