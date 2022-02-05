const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  // email: {
  //   type: String,
  //   unique: true,
  //   required: false,
  // },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("users", userSchema); // here "users" is the collection name in mongodb, User is the model name and we are exporting this model
