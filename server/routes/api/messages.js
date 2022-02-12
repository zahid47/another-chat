const express = require("express");
const passport = require("passport");
const Message = require("../../models/Message");

const router = express.Router();

// @route  GET api/messages/test
// @desc   test messages route
// @access public
router.get("/test", (_, res) => {
  res.status(200).json({ msg: "messages" });
});

// @route  GET api/messages/chatId
// @desc   get messages of a chat
// @access private
router.get(
  "/:chatId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Message.find({ chatId: req.params.chatId })
      .then((mess) => res.status(200).json(mess))
      .catch((err) => res.status(400).json(err));
  }
);

// @route  POST api/message
// @desc   create a new message
// @access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newMessage = new Message({
      chatId: req.body.chatId,
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
  }
);

// @route  PUT api/messages/:msgId
// @desc   update a message by msgId
// @access private
router.put(
  "/:msgId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("update msg");
  }
);

// @route  DELETE api/messages/:msgId
// @desc   delete a message by msgId
// @access private
router.delete(
  "/:msgId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("delete msg");
  }
);

module.exports = router;
