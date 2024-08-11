import express from "express";
import http from "http";
import morgan from "morgan";
import "dotenv/config";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import fetch from "node-fetch"; // Asegúrate de tener node-fetch instalado

import { PORT } from "./config.js";

// Initializations
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
  connectionStateRecovery: {},
});

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

io.on("connection", (socket) => {
  console.log("A user has connected! " + socket.id);

  const userID = socket.handshake.auth.usuarioid;
  //const chatid = socket.handshake.auth.chatid;
  console.log("userID: ", userID);
  //console.log("chatid: ", chatid);

  if (userID) {
    // Join the user to the specific chat room
    //socket.join(chatid);

    socket.on("message", async (chatid, body, created_at) => {
      let result;
      console.log(socket.handshake.auth);
      const usuarioid = socket.handshake.auth.usuarioid;
      const username = socket.handshake.auth.username;
      console.log("username: ", username);

      try {
        // Save the message to the database
        result = await fetch("http://localhost:1234/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatid: chatid,
            vchcontenido: body,
            created_at: new Date(created_at),
            usuarioid,
          }),
        });
        const resultData = await result.json();
        console.log("result: ", resultData);

        // Emit the message to the specific chat room
        io.to(chatid).emit("message", {
          vchcontenido: body,
          usuarioid: usuarioid,
          created_at: created_at,
        });
      } catch (error) {
        console.error("Error saving message: ", error);
        result = { status: "error", message: "Error saving message" };
        return result;
      }
    });

    socket.on("disconnect", () => {
      console.log("A user has disconnected! " + socket.id);
    });

    if (!socket.recovered) {
      try {
        // const results = await getChatHistory(chatid)
        // results.rows.forEach(row => {
        //   socket.emit('chat message', row.message, row.id.toString(), row.username)
        // })
      } catch (error) {
        console.error("Error getting chat history: ", error);
      }
    }
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});