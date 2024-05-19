'use client';
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import TimeAgo from 'javascript-time-ago'
// English.
import en from 'javascript-time-ago/locale/en'
import es from 'javascript-time-ago/locale/es'
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
TimeAgo.addDefaultLocale(es)

const getUsername = async () => {
  const username= localStorage.getItem("Username");
  if (username) {
    console.log(`User existed ${username}`)
    return username
  }

  const res = await fetch('https://random-data-api.com/api/users/random_user')
  const { username: randomUsername } = await res.json()

  localStorage.setItem("Username", randomUsername)
  return randomUsername
}

const socket = io("http://localhost:3001");

socket.auth = {
  username: async () => await getUsername(),
  serverOffset: 0
}

interface Message {
  body: string;
  from: string;
  createdAt: Date;
}

export default function MessageComponent() {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  // Create formatter (English).
  const timeAgo = new TimeAgo('es-MX')

  const receiveMessage = (message: Message, serverOffset: number, username: string) => {
    console.log(serverOffset, username)
    const NewMessage: Message = {
      body: message.body,
      from: message.from,
      createdAt: new Date(message.createdAt),
    }
    setConversations((prevMessages) => [...prevMessages, NewMessage]);
  }

  useEffect(() => {
    socket.on("message", receiveMessage)
    return () => {
      socket.off("message", receiveMessage);
    };
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: "You",
      createdAt: new Date(),
    };
    // setConversations(state => [...state, newMessage]);
    setMessage("");
    socket.emit("message", newMessage.body, newMessage.createdAt);
  };

  return (
    <>
      <section className="h-screen bg-zinc-800 text-white">
        <div className="h-96">
          <PerfectScrollbar>
            {conversations.map((message, index) => (
              <div className="message" key={index}>
                <div className="messageTop">
                  <p className="messageText">{message.body}</p>
                  <p className="messageName">{message.from}</p>
                </div>
                <div className="messageBottom">{timeAgo.format(message.createdAt)}</div>
              </div>
            ))}
          </PerfectScrollbar>
        </div>
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
          <h1 className="text-2xl font-bold my-2">Chat Next</h1>
          <input
            name="message"
            type="text"
            placeholder="Write your message..."
            onChange={(e) => setMessage(e.target.value)}
            className="border-2 border-zinc-500 p-2 w-full text-black"
            value={message}
            autoFocus
          />
        </form>
      </section >
    </>
  );
}