import express from "express";
import http from "http";
import morgan from "morgan";
import 'dotenv/config';
import { Server as SocketServer } from "socket.io";

import { PORT } from "./config.js";
import cors from "cors";

// Initializations
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
  connectionStateRecovery: {}
});

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

io.on("connection", (socket) => {
  console.log('An user has connected! ' + socket.id);
  // socket.on("message", (body, createdAt) => {
  //   socket.broadcast.emit("message", {
  //     body,
  //     from: socket.id.slice(8),
  //     createdAt,
  //   });
  // });

  socket.on('message', async (body, created_at) => {
    let result
    const username = socket.handshake.auth.username ?? 'Anonymous'
    console.log('username: ', username)
    // try {
    //   // Save the message to the database
    // } catch (error) {
    //   console.error('Error saving message: ', error)
    //   result = { status: 'error', message: 'Error saving message' }
    //   return result
    // }
    io.emit('message', {
      body: body,
      from: username,
      createdAt: created_at
    }, 1, username);
    // io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
  })

  socket.on("disconnect", () => {
    console.log('An user has disconnected! ' + socket.id);
  });

  if (!socket.recovered) {
    try {
      // const results = await getChatHistory()
      // results.rows.forEach(row => {
      //   socket.emit('chat message', row.message, row.id.toString(), row.username)
      // })
    } catch (error) {
      console.error('Error getting chat history: ', error)
    }
  }

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});