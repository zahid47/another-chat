const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  ///on connection
  console.log("A user connected!");
  //take userId from client
  socket.on("addMe", (userId) => {
    addUser(userId, socket.id);
    //send all users to all clients
    io.emit("getUsers", users);

    ///send and get msgs
    socket.on("sendMsg", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);

      io.to(user.socketId).emit("getMsg", { senderId, text });
    });

    ///on disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
});
