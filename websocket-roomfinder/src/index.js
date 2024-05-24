import express from "express";
import http from "http";
import morgan from "morgan";
import "dotenv/config";
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
  connectionStateRecovery: {},
});

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

io.on("connection", (socket) => {
  console.log("An user has connected! " + socket.id);

  const userID = socket.handshake.auth.userID;
  if (userID)
    socket.on("message", async (body, created_at) => {
      let result;
      console.log(socket.handshake.auth);
      const usuarioid = socket.handshake.auth.usuarioid ?? 1;
      const username = socket.handshake.auth.username ?? "Anonymous";
      const chatid = socket.handshake.auth.chatid ?? 1;
      console.log("username: ", username);
      try {
        // Save the message to the database
        result = await fetch("http://localhost:1234/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatid,
            vchcontenido: body,
            created_at,
            usuarioid,
          }),
        });
      } catch (error) {
        console.error("Error saving message: ", error);
        result = { status: "error", message: "Error saving message" };
        return result;
      }
      io.emit(
        "message",
        {
          body: body,
          from: username,
          usuarioid: usuarioid,
          createdAt: created_at,
        },
        result.messageid,
        username,
      );
      // io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
    });

  socket.on("disconnect", () => {
    console.log("An user has disconnected! " + socket.id);
  });

  if (!socket.recovered) {
    try {
      // const results = await getChatHistory()
      // results.rows.forEach(row => {
      //   socket.emit('chat message', row.message, row.id.toString(), row.username)
      // })
    } catch (error) {
      console.error("Error getting chat history: ", error);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
