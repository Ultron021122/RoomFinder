"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import io from "socket.io-client";
import TimeAgo from "javascript-time-ago";
import es from "javascript-time-ago/locale/es";
import { Message, UserProfile } from "@/utils/interfaces";
import axios from "axios";
import Image from "next/image";
import { Avatar, Badge } from "@nextui-org/react";

TimeAgo.addDefaultLocale(es);

const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET}`, {
  autoConnect: false, // disable auto-connect to set auth
});

export default function MessageComponent({
  userID,
  image,
  nameUser,
  name,
  bnstatus,
  className,
  onBack
}: {
  userID: number,
  image: string,
  nameUser: string,
  name: string
  bnstatus: boolean,
  className?: string | null,
  onBack: () => void
}) {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [chatID, setChatID] = useState<number | null>(null);
  const hasFetched = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Nueva referencia para el scroll

  const timeAgo = new TimeAgo("es-ES");

  const { data: session } = useSession();
  const user = session?.user as UserProfile;

  // Conectar al servidor cuando el usuario está autenticado
  useEffect(() => {
    if (user) {
      socket.auth = {
        usuarioid: user.usuarioid,
        username: user.vchname,
      };
      socket.connect();

      if (chatID) {
        socket.emit("join", chatID);
        socket.emit("getMessages", { chatid: chatID });
      }

      socket.on("receiveMessages", (data) => {
        setConversations((prev) => [...prev, ...data]);
      });

      socket.on("receiveMessage", (newMessage) => {
        setConversations((prev) => [...prev, newMessage]);
      });

      return () => {
        socket.off("receiveMessages");
        socket.off("receiveMessage");
        socket.disconnect();
      };
    }
  }, [user, chatID]);

  useEffect(() => {
    if (userID) {
      const fetchMessages = async () => {
        try {
          const response = await axios.post('/api/chats', {
            usuario1id: user?.usuarioid,
            usuario2id: userID
          });
          console.log(response.data);
          setChatID(response.data.data.chatid);
          setConversations([]); // Limpiar las conversaciones al cambiar de usuario
          hasFetched.current = true; // Permitir la recuperación de mensajes
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [userID, user]);


  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() && chatID) {
      const newMessage: Message = {
        chatid: chatID as number,
        vchcontenido: message,
        usuarioid: user?.usuarioid,
        created_at: new Date(),
      };
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  // Efecto para hacer scroll hacia abajo cuando cambian las conversaciones
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations]);

  return (
    <div>
      <section className={`h-[calc(100vh-150px)] flex flex-col bg-gray-100 dark:bg-gray-900 ${className}`}>
        <div className="h-full w-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white dark:bg-gray-950 dark:border-gray-900">
            <div className="flex items-center">
              <div className="md:hidden cursor-pointer" onClick={onBack}>
                <ArrowLeftIcon size={20} className="text-gray-500 dark:text-gray-300 mr-2 hover:text-gray-700 dark:hover:text-gray-100" />
              </div>
              <Badge content="" color={bnstatus == true ? "success" : "danger"} shape="circle" placement="bottom-right">
                <Avatar
                  radius="full"
                  src={image}
                />
              </Badge>
              <p className="ml-2 text-sm sm:text-base font-semibold dark:text-neutral-50">
                {nameUser}
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div>
              {conversations.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="p-4 text-gray-500 dark:text-gray-300 text-center text-sm">No hay mensajes en esta conversación.</p>
                </div>
              ) : (
                conversations.map((msg, index) => (
                  <div key={`${msg.usuarioid}-${index}`} className="flex flex-col mt-5 px-3">
                    {msg.usuarioid === user?.usuarioid ? (
                      <div className="flex justify-end items-center mb-2">
                        <div className="max-w-full sm:max-w-[calc(80%-40px)] text-right">
                          <p
                            className="text-xs dark:text-gray-100 font-semibold">
                            Tú
                          </p>
                          <div
                            className="py-2 px-3 max-w-max bg-blue-400 rounded-bl-lg rounded-br-lg rounded-tl-lg text-white text-sm shadow-md">
                            <p>{msg.vchcontenido}</p>
                          </div>
                          <span className="text-xs dark:text-gray-300">
                            {timeAgo.format(new Date(msg.created_at))}
                          </span>
                        </div>
                        <Image
                          width={100}
                          height={100}
                          src={user?.vchimage}
                          alt="avatar"
                          className="object-cover h-10 w-10 rounded-full ml-2 border-2 border-white"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-start items-center mb-2">
                        <Image
                          width={100}
                          height={100}
                          src={image}
                          className="object-cover h-10 w-10 rounded-full mr-2 border-2 border-white"
                          alt="avatar"
                        />
                        <div className="max-w-full sm:max-w-[calc(80%)] text-left">
                          <p
                            className="text-xs dark:text-gray-100 font-semibold">
                            {name}
                          </p>
                          <div
                            className="py-2 px-3 max-w-max bg-green-600 rounded-bl-lg rounded-tr-lg rounded-br-lg text-white text-sm shadow-md"
                          >
                            <p>{msg.vchcontenido}</p>
                          </div>
                          <span className="text-xs dark:text-gray-300">
                            {timeAgo.format(new Date(msg.created_at))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              {/* Este div es la referencia para el scroll */}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <form onSubmit={sendMessage} className="flex justify-between items-center p-4 dark:bg-gray-950 border-t border-gray-800">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 p-2 border text-sm dark:text-neutral-50 border-gray-300 dark:border-gray-700 dark:bg-gray-600 rounded-lg"
            />
            <button type="submit" className="ml-2 p-2 bg-green-500 text-white rounded-lg">
              <SendIcon size={20} />
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
    </div>
  );
}
