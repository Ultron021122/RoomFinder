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
import { useSession } from "next-auth/react";
TimeAgo.addDefaultLocale(es)

const socket = io("http://localhost:3001");

interface Message {
  body: string;
  from: string;
  usuarioid: number;
  createdAt: Date;
}

export default function MessageComponent() {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const user = session?.user;
  // Create formatter (English).
  const timeAgo = new TimeAgo('es-MX')

  socket.auth = {
    usuarioid: (user as any)?.usuarioid,
    username: (user as any)?.vchname,
    serverOffset: 0
  }

  const receiveMessage = (message: Message, serverOffset: number, username: string) => {
    console.log(serverOffset, username)
    const NewMessage: Message = {
      body: message.body,
      from: message.from,
      usuarioid: message.usuarioid,
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
      usuarioid: (user as any)?.usuarioid,
      createdAt: new Date(),
    };
    // setConversations(state => [...state, newMessage]);
    setMessage("");
    socket.emit("message", newMessage.body, newMessage.createdAt);
  };

  return (
    <>
      <section className="h-screen bg-zinc-800 text-white">
        <div className="h-96 w-full px-5 flex flex-col justify-between">
          <PerfectScrollbar>
            {conversations.map((message, index) => (
              <>
                {message.usuarioid === (user as any)?.usuarioid ?
                  (
                    <div className="flex flex-col mt-5 px-3" key={index}>
                      <div className="flex justify-end mb-4">
                        <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                          {message.body}
                        </div>
                        <Image
                          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                          alt="avatar"
                          className="object-cover h-10 w-10 rounded-full"
                        />
                        <div className="text-xs">{timeAgo.format(message.createdAt)}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start mb-4 px-3" key={index}>
                      <Image
                        src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                        className="object-cover h-10 w-10 rounded-full"
                        alt=""
                      />
                      <div
                        className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white max-w-[250px] md:max-w-screen-sm"
                      >
                        {message.body}
                      </div>
                      <div className="text-xs">{timeAgo.format(message.createdAt)}</div>
                    </div>
                  )
                }
              </>
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