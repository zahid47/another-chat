const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const secretOrKey = require("../../config/secrets").secretOrKey;
const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");

//TODO: protect private routes!!!

const router = express.Router();

// @route  GET api/chat
// @desc   chat route
// @access private
router.get("/", (req, res) => {
  res.status(200).json({ msg: "chat" });
});

// @route  POST api/chat/conversations
// @desc   conversations route
// @access private
router.post("/conversations", (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  newConversation
    .save()
    .then((conv) => {
      res.status(200).json(conv);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// @route  GET api/chat/conversations
// @desc   get conversations of a user
// @access private
router.get("/conversations/:userId", (req, res) => {
  Conversation.find({ members: { $in: [req.params.userId] } })
    .then((conv) => res.status(200).json(conv))
    .catch((err) => res.status(400).json(err));
});

// @route  POST api/chat/message
// @desc   message route
// @access private
router.post("/message", (req, res) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    senderId: req.body.senderId,
    text: req.body.text,
  });
  newMessage
    .save()
    .then((mess) => {
      res.status(200).json(mess);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// @route  GET api/chat/conversations/conversationId
// @desc   get messages of a conversation
// @access private
router.get("/message/:conversationId", (req, res) => {
  Message.find({ conversationId: req.params.conversationId })
    .then((mess) => res.status(200).json(mess))
    .catch((err) => res.status(400).json(err));
});

module.exports = router;
