const express = require("express");
const User = require("../../models/User");

const router = express.Router();

// @route  GET api/user
// @desc   get user from id
// @access public
router.get("/:userId", (req, res) => {
  User.findById(req.params.userId)
    .then((response) =>
      res.status(200).json({
        id: response.id,
        username: response.username,
      })
    )
    .catch((err) => res.status(400).json(err));
});

// @route  GET api/user
// @desc   get user from username
// @access public
router.get("/name/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((response) =>
      res.status(200).json({
        id: response.id,
        username: response.username,
      })
    )
    .catch((err) => res.status(400).json(err));
});

module.exports = router;
