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

  socket.on('join', (chatid) => {
    console.log('User joined the chat:', chatid);
    socket.join(chatid);
  });

  socket.on('message', async (data) => {
    console.log('', data);
    const { chatid, usuarioid, vchcontenido, created_at } = data;

    try {
      // Save the message in the database
      const response = await fetch(`${process.env.API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.API_SECRET}`,
        },
        body: JSON.stringify({ chatid, usuarioid, vchcontenido, created_at }),
      });
      // Send the message to the receiver
      io.to(chatid).emit('receiveMessage', { chatid, usuarioid, vchcontenido, created_at });
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
  });

  socket.on('getMessages', async (data) => {
    const { chatid } = data;

    try {
      const result = await fetch(`${process.env.API_URL}/messages/chat/${chatid}`, {
        headers: {
          "Authorization": `Bearer ${process.env.API_SECRET}`,
        },
      });
      const messages = await result.json();
      socket.emit('receiveMessages', messages);
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
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