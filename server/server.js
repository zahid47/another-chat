const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const secrets = require("./config/secrets");
const auth = require("./routes/api/auth");
const chat = require("./routes/api/conversations");
const users = require("./routes/api/users");

//express stuff
const app = express();
const PORT = 8000 || secrets.PORT;
//body-parser stuff
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//passport stuff
app.use(passport.initialize());
require("./config/passport")(passport);
//cors stuff
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
///

//mongo stuff
const db = secrets.mongodbURI;
mongoose
  .connect(db)
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch((err) => {
    console.error(err);
  });
///

app.get("/", (req, res) => {
  res.status(200).json({ msg: "welcome" });
});

//Routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/chat", chat);
///

app.listen(PORT, () => {
  console.log(`app running at port ${PORT}`);
});
