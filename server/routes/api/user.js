const express = require("express");
const passport = require("passport");
const User = require("../../models/User");

const router = express.Router();

// @route  GET api/user/test
// @desc   Tests user route
// @access public
router.get("/test", (_, res) => {
  res.status(200).json({ msg: "user" });
});

// @route  GET api/user/all
// @desc   get all users
// @access private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (_, res) => {
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

// @route  GET api/user/id/:userId
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

// @route  GET api/user/name/:username
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

// @route  DELETE api/user
// @desc   delete current user
// @access private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findByIdAndDelete(req.user.id)
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(502).json(err));
  }
);

// @route  PUT api/user
// @desc   update current user
// @access private
router.put(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
            .then((user) => res.status(200).json(user))
            .catch(() =>
              res.status(502).json({ error: "could not update the user" })
            );
        }
      });
    } else {
      res.status(400).json({ error: "nothing to update" });
    }
  }
);

// @route  GET api/user/me
// @desc   get currently logged in user
// @access private
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
    });
  }
);

module.exports = router;
