const clientURL = require("./config/secrets");

const io = require("socket.io")(8900, {
  cors: {
    origin: clientURL,
  },
});

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  ///on connection
  console.log(`${socket.id} has connected!`);

  //save new user in users array
  socket.on("addMe", (userId) => {
    addUser(userId, socket.id);

    ///send and get msgs
    socket.on("sendMsg", ({ senderId, receiverId, text }) => {
      const receiver = getUser(receiverId);

      io.to(receiver.socketId).emit("getMsg", { senderId, text });
    });

    ///on disconnection
    socket.on("disconnect", () => {
      console.log(`${socket.id} has disconnected!`);
      //remove user from users array
      removeUser(socket.id);
    });
  });
});
