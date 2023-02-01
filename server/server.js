const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(3000, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:8080"],
    credentials: true,
  },
});

const userIo = io.of("/user");

userIo.on("connection", (socket) => {
  console.log(`connected to user namespace with username ${socket.username}`);
});

userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUserNameFromToken(socket.handshake.auth.token);
    next();
  } else {
    next(new Error("Token missing!"));
  }
});

function getUserNameFromToken(token) {
  return token;
}

io.on("connection", (socket) => {
  console.log("connected to index namespace");

  socket.on("send-message", (message, room, user) => {
    if (room === "") {
      socket.broadcast.emit("get-message", message, user);
    } else {
      socket.to(room).emit("get-message", message, user);
    }
  });

  socket.on("join-room", (room, callback) => {
    socket.join(room);
    callback(`Joined ${room}!`);
  });
  socket.on("ping", (number) => console.log(number));
});

instrument(io, {
  auth: false,
});
