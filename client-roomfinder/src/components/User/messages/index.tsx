"use client";
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import TimeAgo from "javascript-time-ago";
// English.
import en from "javascript-time-ago/locale/en";
import es from "javascript-time-ago/locale/es";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useSession } from "next-auth/react";
import { SendIcon } from "lucide-react";
TimeAgo.addDefaultLocale(es);

const socket = io("http://localhost:3001", {
  autoConnect: false, // disable auto-connect to set auth
});

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
  const timeAgo = new TimeAgo("es-MX");

  useEffect(() => {
    if (user) {
      socket.auth = {
        usuarioid: (user as any)?.usuarioid,
        username: (user as any)?.vchname,
        serverOffset: 0,
      };
      socket.connect(); // Connect manually after setting auth

      socket.on("message", (newMessage: Message) => {
        setConversations((prevConversations) => [...prevConversations, newMessage]);
      });

      // Clean up the socket connection when the component unmounts
      return () => {
        //socket.off("message");
        socket.disconnect();
      };
    }
  }, [user]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage: Message = {
        body: message,
        from: (user as any)?.vchname,
        usuarioid: (user as any)?.usuarioid,
        createdAt: new Date(),
      };
      socket.emit("message", newMessage.body, newMessage.createdAt);
      setConversations((prevConversation) => [...prevConversation, newMessage]);
      setMessage("");
    }
  };

  return (
    <>
      <section className="h-[calc(100vh-150px)] flex flex-col bg-white dark:bg-gray-950">
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {/* <PerfectScrollbar> */}
          {conversations.map((message, index) => (
            <>
              {message.usuarioid === (user as any)?.usuarioid ? (
                <div className="flex flex-col mt-5 px-3" key={index}>
                  <div className="flex justify-end items-center mb-2">
                    <div className="py-3 px-4 bg-blue-400 rounded-lg text-white text-sm shadow-md max-w-[calc(80%-40px)]">
                      {message.body}
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1573455494057-12684d151bf4?q=80&w=600"
                      alt="avatar"
                      className="object-cover h-10 w-10 rounded-full ml-2 border-2 border-white"
                    />
                  </div>
                  <div className="text-xs text-gray-500 flex justify-end">
                    {timeAgo.format(message.createdAt)}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col mt-5 px-3" key={index}>
                  <div className="flex justify-start items-center mb-2">
                    <Image
                      src="https://images.unsplash.com/photo-1722799037558-69a4dc8e08d1?q=80&w=600"
                      className="object-cover h-10 w-10 rounded-full mr-2 border-2 border-white"
                      alt=""
                    />
                    <div className="py-3 px-4 bg-gray-400 rounded-lg text-white text-sm shadow-md max-w-[calc(80%)]">
                      {message.body}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-start">
                    {timeAgo.format(message.createdAt)}
                  </div>
                </div>
              )}
            </>
          ))}
          <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })}></div>
          {/* </PerfectScrollbar> */}
        </div>
        <form
          onSubmit={sendMessage}
          className="flex justify-between items-center p-4 dark:bg-gray-950 border-t border-gray-800"
        >
          <input
            name="message"
            type="text"
            placeholder="Escribe tú mensaje..."
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow px-2 py-1 mr-2 h-12 text-sm text-neutral-950 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-md focus:outline-none"
            value={message}
            autoFocus
            autoCapitalize="off"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
          >
            <SendIcon size={24} />
          </button>
        </form>
      </section>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </>
  );
}
