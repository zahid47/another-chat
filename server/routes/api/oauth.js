const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const secretOrKey = require("../../config/secrets").secretOrKey;
const User = require("../../models/User");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const router = express.Router();

// @route  GET api/auth
// @desc   Tests auth route
// @access public
router.get("/", (req, res) => {
  res.status(200).json({ msg: "oauth" });
});

module.exports = router;
