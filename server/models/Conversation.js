const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    members: {
      type: Array,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = Conversation = mongoose.model(
  "conversations",
  conversationSchema
);
