const express = require("express");
const http = require("http");
let cors = require('cors');
const {Server } = require("socket.io");
const app = express();
app.use(cors())
const port = process.env.PORT || 3001;

const index = require("./routes/index");


app.use(index);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
//const io = socketIo(server); // < Interesting!

let interval;

io.on("connection", (socket) => {
  console.log(`New client connected`);
  socket.emit("getUserSocketID",`New client connected ${socket.id}`)
//   socket.on("test",(msg)=>{
//     console.log("emit",msg)
//     socket.emit("hellotest","hello")
//})
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(socket), 1000);
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});


const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};


server.listen(port, () => console.log(`Listening on port ${port}`));