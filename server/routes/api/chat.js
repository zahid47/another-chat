const express = require("express");
const passport = require("passport");
const Chat = require("../../models/Chat");
const isEmpty = require("../../validation/isEmpty");

const router = express.Router();

// @route  GET api/chat/test
// @desc   test chat route
// @access public
router.get("/test", (_, res) => {
  res.status(200).json({ msg: "chat" });
});

// @route  GET api/chat/
// @desc   get chat of current user
// @access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Chat.find({ members: { $in: [req.user.id] } })
      .then((chat) => res.status(200).json(chat))
      .catch((err) => res.status(500).json(err));
  }
);

// @route  POST api/chat
// @desc   create a new chat
// @access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //check if senderId is not empty
    if (isEmpty(req.body.senderId)) {
      return res.status(400).json({ error: "senderId can not be empty" });
    }
    //check if receiverId is not empty
    if (isEmpty(req.body.receiverId)) {
      return res.status(400).json({ error: "receiverId can not be empty" });
    }

    if (req.user.id !== req.body.senderId) {
      return res
        .status(400)
        .json({ err: "senderId must be currently logged in users id" });
    }

    //make sure senderId and receiverId is different (cant create a chat w yourself!)
    if (req.body.senderId === req.body.receiverId) {
      return res
        .status(400)
        .json({ error: "senderId and receiverId can not be the same" });
    }

    //check if we already have a chat with this receiver
    Chat.findOne({ members: [req.body.senderId, req.body.receiverId] })
      .then((chat) => {
        if (chat) {
          //cant create another chat
          res
            .status(400)
            .json({ error: "You already have a conversation with this friend." });
        } else {
          Chat.findOne({ members: [req.body.receiverId, req.body.senderId] })
            .then((chat) => {
              if (chat) {
                //cant create another chat
                return res
                  .status(400)
                  .json({ error: "You already have a conversation with this friend." });
              } else {
                //create a new chat
                const newChat = new Chat({
                  members: [req.body.senderId, req.body.receiverId],
                });

                newChat
                  .save()
                  .then((chat) => {
                    res.status(201).json(chat);
                  })
                  .catch((err) => {
                    res.status(500).json(err);
                  });
              }
            })
            .catch((err) => res.status(400).json(err));
        }
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route  DELETE api/chat/:chatId
// @desc   delete a chat by chatId
// @access private
router.delete(
  "/:chatId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //find chat by chatId
    Chat.findById(req.params.chatId)
      .then((chat) => {
        //check if the chat has current user as member
        if (chat.members.includes(req.user.id)) {
          //delete the chat
          Chat.findByIdAndDelete(req.params.chatId)
            .then((response) => res.status(200).json(response))
            .catch((err) => res.status(500).json(err));
        } else {
          //cant delete others chat!
          res.status(401).json({ error: "unauthorized" });
        }
      })
      .catch(() => res.status(400).json({ error: "could not find the chat" }));
  }
);

module.exports = router;
