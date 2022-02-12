const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    members: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Chat = mongoose.model(
  "chats",
  chatSchema
);
