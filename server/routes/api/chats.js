const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Chat = require("../../models/Chat");
const isEmpty = require("../../validation/isEmpty");

const router = express.Router();

// @route  GET api/chats/test
// @desc   test chats route
// @access public
router.get("/test", (_, res) => {
  res.status(200).json({ msg: "chats" });
});

// @route  GET api/chats/:userId
// @desc   get chats of an user
// @access private
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Chat.find({ members: { $in: [req.params.userId] } })
      .then((chat) => res.status(200).json(chat))
      .catch((err) => res.status(400).json(err));
  }
);

// @route  POST api/chats
// @desc   create a new chat
// @access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //check if senderId is not empty
    if (!isEmpty(req.body.senderId)) {
      //check if receiverId is not empty
      if (!isEmpty(req.body.receiverId)) {
        //make sure senderId and receiverId is different (cant create a chat w yourself!)
        if (req.body.senderId !== req.body.receiverId) {
          //check if we already have a chat with this receiver
          Chat.findOne({ members: [req.body.senderId, req.body.receiverId] })
            .then((chat) => {
              if (chat) {
                //we do, cant create another chat
                return res
                  .status(400)
                  .json({ error: "already have a chat with this receiver" });
              } else {
                //we dont, create a new chat
                const newChat = new Chat({
                  members: [req.body.senderId, req.body.receiverId],
                });

                newChat
                  .save()
                  .then(() => {
                    res.status(200).json({ success: true });
                  })
                  .catch(() => {
                    res
                      .status(500)
                      .json({ error: "could not create a new chat" });
                  });
              }
            })
            .catch((err) => res.status(400).json(err));
        } else {
          res
            .status(400)
            .json({ error: "senderId and receiverId can not be the same" });
        }
      } else {
        res.status(400).json({ error: "receiverId can not be empty" });
      }
    } else {
      res.status(400).json({ error: "senderId can not be empty" });
    }
  }
);

// @route  DELETE api/chats/:chatId
// @desc   delete a chat
// @access private
router.delete(
  "/:chatId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //decoding the currently logged it users data
    const jwtData = jwt.decode(req.headers.authorization.split(" ")[1]);

    //find chat by chatId
    Chat.findById(req.params.chatId)
      .then((chat) => {
        //check if the chat has current user as member
        if (chat.members.includes(jwtData.id)) {
          //delete the chat
          Chat.findByIdAndDelete(req.params.chatId)
            .then(() => res.status(200).json({ success: true }))
            .catch(() =>
              res.status(502).json({ error: "could not delete the chat" })
            );
        } else {
          //cant delete others chat!
          res.status(401).json({ error: "unauthorized" });
        }
      })
      .catch(() => res.status(400).json({ error: "could not find the chat" }));
  }
);

module.exports = router;
