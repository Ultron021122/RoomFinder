'use client';
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import TimeAgo from 'javascript-time-ago'
// English.
import en from 'javascript-time-ago/locale/en'
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
TimeAgo.addDefaultLocale(en)

const socket = io(process.env.SOCKET_URL as string);

interface Message {
  body: string;
  from: string;
  createdAt: Date;
}

export default function MessageComponent() {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  // Create formatter (English).
  const timeAgo = new TimeAgo('en-US')

  const receiveMessage = (message: Message) => {
    const NewMessage: Message = {
      body: message.body,
      from: "Server",
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
    console.log(newMessage)
    setConversations(state => [...state, newMessage]);
    setMessage("");
    socket.emit("message", newMessage.body, newMessage.createdAt);
  };

  return (
    <>
      <section className="h-screen bg-zinc-800 text-white">
        <div className="h-72">
          <PerfectScrollbar>
            {conversations.map((message, index) => (
              <div className="message" key={index}>
                <div className="messageTop">
                  <p className="messageText">{message.body}</p>
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