const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve static files (CSS, JS, images) from the 'public' folder
app.use(express.static(path.join(__dirname,'public')));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("A user is connected : ");

  // read data send from client
  socket.on("clent message", (msg) => {
    console.log("send from client : " + msg);
    //   send a message to all clients except the send of message
    socket.broadcast.emit("server message", msg);
  });

  // Handle video call request
  socket.on("video call request", (data) => {
    console.log("Video call request from:", data.from);
    // Forward the video call request to the recipient
    socket.broadcast.emit("receive video call", { from: data.from });
  });

  // Handle video call acceptance
  // socket.on("video call accepted", (data) => {
  //   console.log("Video call accepted by:", data.to);
  //   // Notify the caller that the call was accepted
  //   socket.broadcast.emit("video call accepted notification", { to: data.to });
  // });
});

server.listen(3001, () => {
  console.log("server running at http://localhost:3000");
});