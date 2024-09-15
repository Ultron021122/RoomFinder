"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SendIcon } from "lucide-react";
import io from "socket.io-client";
import TimeAgo from "javascript-time-ago";
import es from "javascript-time-ago/locale/es";
import { Image } from "@nextui-org/react";
import { UserProfile } from "@/utils/interfaces";

TimeAgo.addDefaultLocale(es);

const socket = io(`${process.env.NEXTAUTH_URL_WEBSOCKET}`, {
  autoConnect: false, // disable auto-connect to set auth
});

interface Message {
  vchcontenido: string;
  usuarioid: number;
  chatid: number;
  created_at: Date;
}

interface Chat {
  chatid: number;
  usuario1id: number;
  usuario2id: number;
  created_at: Date;
}

export default function MessageComponent({ userID, className }: { userID: number, className?: string | null }) {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  const { data: session } = useSession();
  const user = session?.user as UserProfile;
  const timeAgo = new TimeAgo("es-MX");

  // Connect to the server when the user is authenticated
  useEffect(() => {
    if (user) {
      socket.auth = {
        usuarioid: user?.usuarioid,
        username: user?.vchname,
        serverOffset: 0,
      };
      socket.connect(); // Connect manually after setting auth

      socket.on("message", (newMessage: Message) => {
        if (newMessage.usuarioid === user?.usuarioid || userID) {
          setConversations((prevConversations) => [...prevConversations, newMessage]);
        }
      });

      return () => {
        socket.off("message"); // Clean up the event listener
        socket.disconnect();
      };
    }
  }, [user, userID]);

  // Fetch chats and messages when the component mounts
  useEffect(() => {
    // Fetch chats from the server
    console.log("Fetching chats for user:", user?.usuarioid);
    const fetchChats = async () => {
      try {
        console.log("Prueba 1")
        const response = await fetch(`${process.env.NEXT_PUBLIC_REST_URL}/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario1id: user.usuarioid, usuario2id: userID }), // Enviar el userID en el cuerpo de la solicitud
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [user, userID]);

  useEffect(() => {
    if (userID) {
      // Fetch messages for the selected chat
      const fetchMessages = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_REST_URL}/messages/chat/${userID}`);
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          setConversations(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [userID]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() && userID) {
      console.log("Sending message:", userID);
      const newMessage: Message = {
        chatid: userID,
        vchcontenido: message,
        usuarioid: (user as any)?.usuarioid,
        created_at: new Date(),
      };
      socket.emit("message", newMessage.chatid, newMessage.vchcontenido, newMessage.created_at);
      setConversations((prevConversations) => [...prevConversations, newMessage]);
      setMessage("");
    }
  };

  return (
    <>
      <section className={`h-[calc(100vh-150px)] flex flex-col bg-white dark:bg-gray-950 ${className}`}>
        <div className="h-full w-full flex flex-col"> 
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div>
              {conversations.length === 0 ? (
                <p className="p-4 text-gray-500">No hay mensajes en esta conversación.</p>
              ) : (
                conversations.map((msg, index) => (
                  <div key={`${msg.usuarioid}-${index}`} className="flex flex-col mt-5 px-3">
                    {msg.usuarioid === (user as any)?.usuarioid ? (
                      <div className="flex justify-end items-center mb-2">
                        <div className="py-3 px-4 bg-blue-400 rounded-lg text-white text-sm shadow-md max-w-[calc(80%-40px)]">
                          {msg.vchcontenido}
                        </div>
                        <Image
                          src="https://images.unsplash.com/photo-1573455494057-12684d151bf4?q=80&w=600"
                          alt="avatar"
                          className="object-cover h-10 w-10 rounded-full ml-2 border-2 border-white"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-start items-center mb-2">
                        <Image
                          src="https://images.unsplash.com/photo-1722799037558-69a4dc8e08d1?q=80&w=600"
                          className="object-cover h-10 w-10 rounded-full mr-2 border-2 border-white"
                          alt="avatar"
                        />
                        <div className="py-3 px-4 bg-gray-400 rounded-lg text-white text-sm shadow-md max-w-[calc(80%)]">
                          {msg.vchcontenido}
                        </div>
                      </div>
                    )}
                    <div className={`text-xs text-gray-500 flex ${msg.usuarioid === (user as any)?.usuarioid ? "justify-end" : "justify-start"}`}>
                      <p></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <form onSubmit={sendMessage} className="flex justify-between items-center p-4 dark:bg-gray-950 border-t border-gray-800">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button type="submit" className="ml-2 p-2 bg-green-500 text-white rounded-lg">
              <SendIcon />
            </button>
          </form>
        </div>
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
