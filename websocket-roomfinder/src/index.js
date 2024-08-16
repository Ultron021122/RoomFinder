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

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async (data) => {
    const { from, to, message } = data;

    try {
      // Save the message in the database
      const response = await fetch(`${process.env.API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, message }),
      });
      // Send the message to the receiver
      io.to(to).emit('receiveMessage', { from, message });
    } catch (error) {
      console.error('Error al guardar el mensaje:',error);
    }
  });

  socket.on('getMessages', async (data) => {
    const { user1, user2 } = data;

    try {
      const result = await fetch(`${process.env.API_URL}/messages?user1=${user1}&user2=${user2}`);
      const messages = await result.json();
      socket.emit('receiveMessages', messages);
    } catch (error) {
      console.error('Error al obtener los mensajes:',error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user has disconnected! " + socket.id);
  });

});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});