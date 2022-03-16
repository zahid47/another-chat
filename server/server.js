const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const secrets = require("./config/secrets");
//routes
const auth = require("./routes/api/auth");
const user = require("./routes/api/user");
const chat = require("./routes/api/chat");
const message = require("./routes/api/message");

const clientURL = require("./config/secrets");

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
    origin: clientURL,
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
app.use("/api/user", user);
app.use("/api/chat", chat);
app.use("/api/message", message);
///

app.listen(PORT, () => {
  console.log(`app running at port ${PORT}`);
});
