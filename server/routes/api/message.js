const express = require("express");
const passport = require("passport");
const Chat = require("../../models/Chat");
const Message = require("../../models/Message");
const isEmpty = require("../../validation/isEmpty");

const router = express.Router();

// @route  GET api/message/test
// @desc   test message route
// @access public
router.get("/test", (_, res) => {
  res.status(200).json({ msg: "message" });
});

// @route  GET api/message/:chatId
// @desc   get messages of a chat
// @access private
router.get(
  "/:chatId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Chat.findById(req.params.chatId)
      .then((chat) => {
        //check if current user looking for their own msg
        if (chat.members.includes(req.user.id)) {
          Message.find({ chatId: req.params.chatId })
            .then((msg) => res.status(200).json(msg))
            .catch((err) => res.status(500).json(err));
        } else {
          res.status(401).json({ error: "unauthorized" });
        }
      })
      .catch((err) => res.status(500).json(err));
  }
);

// @route  GET api/message/id/:msgId
// @desc   get message by msgId
// @access private
router.get(
  "/id/:msgId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Message.findById(req.params.msgId)
      .then((msg) => {
        //check if current user looking for their own msg
        Chat.findById(msg.chatId)
          .then((chat) => {
            if (chat.members.includes(req.user.id)) {
              res.status(200).json(msg);
            } else {
              res.status(401).json({ error: "unauthorized" });
            }
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  }
);

// @route  POST api/message
// @desc   create a new message
// @access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isEmpty(req.body.chatId)) {
      return res.status(400).json({ error: "chatId can't be empty" });
    }

    if (isEmpty(req.body.senderId)) {
      return res.status(400).json({ error: "senderId can't be empty" });
    }

    if (isEmpty(req.body.text)) {
      return res.status(400).json({ error: "text can't be empty" });
    }

    if (req.user.id !== req.body.senderId) {
      return res
        .status(400)
        .json({ err: "senderId must be currently logged in users id" });
    }

    if (req.body.senderId !== req.user.id) {
      return res.status(400).json({ error: "unauthorized" });
    }

    //check if user belongs in the chat
    Chat.findById(req.body.chatId)
      .then((chat) => {
        if (!chat.members.includes(req.user.id)) {
          return res.status(400).json({ error: "unauthorized" });
        }
      })
      .catch((err) => {
        return res.status(400).json(err);
      });

    //all good, create new msg
    const newMessage = new Message({
      chatId: req.body.chatId,
      senderId: req.body.senderId,
      text: req.body.text,
    });
    newMessage
      .save()
      .then((msg) => {
        res.status(201).json(msg);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
);

// @route  PUT api/message/:msgId
// @desc   update a message by msgId
// @access private
router.put(
  "/:msgId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //check if new text exists
    if (isEmpty(req.body.text)) {
      return res.status(400).json({ error: "nothing to update" });
    }

    Message.findById(req.params.msgId)
      .then((msg) => {
        //check if current user is updating their own msg (they cant update others msg duh!)
        if (req.user.id === msg.senderId) {
          //ok updating own msg!
          const updatedData = {
            text: req.body.text,
          };
          //update on DB
          Message.findByIdAndUpdate(req.params.msgId, updatedData)
            .then((msg) => res.status(200).json(msg))
            .catch((err) => res.status(502).json(err));
        } else {
          res.status(401).json({ error: "unauthorized" });
        }
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route  DELETE api/message/:msgId
// @desc   delete a message by msgId
// @access private
router.delete(
  "/:msgId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //check if current user is deleting their own msg (they cant update others msg duh!)
    Message.findById(req.params.msgId)
      .then((msg) => {
        if (req.user.id === msg.senderId) {
          //ok deleting own msg!
          //delete on DB
          Message.findByIdAndDelete(req.params.msgId)
            .then((msg) => res.status(200).json(msg))
            .catch(() =>
              res.status(502).json({ error: "could not delete the message" })
            );
        } else {
          res.status(401).json({ error: "unauthorized" });
        }
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
