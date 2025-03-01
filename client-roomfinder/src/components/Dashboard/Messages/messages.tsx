"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ArrowLeft, SendIcon, SmileIcon, StickerIcon } from "lucide-react";
import io from "socket.io-client";
import TimeAgo from "javascript-time-ago";
import es from "javascript-time-ago/locale/es";
import { Message, UserProfile } from "@/utils/interfaces";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

TimeAgo.addDefaultLocale(es);

const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET}`, {
  autoConnect: false,
});

const useSocket = (user: UserProfile | undefined, chatID: number | null) => {
  const [conversations, setConversations] = useState<Message[]>([]);

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

  return { conversations, setConversations };
};

export default function MessageComponent({
  userID,
  image,
  nameUser,
  className,
  onBack,
}: {
  userID: number;
  image: string;
  nameUser: string;
  className?: string | null;
  onBack: () => void;
}) {
  const { data: session } = useSession();
  const user = session?.user as UserProfile;
  const [chatID, setChatID] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiList = useMemo(() => ["😊", "😂", "😍", "😢", "😎", "👍", "🙌", "😒", "👻", "👽", "😈", "👿", "🤡", "🤠", "🤮", "🤢", "🤕", "😵", "🥵"], []);
  const { conversations, setConversations } = useSocket(user, chatID);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const timeAgo = useMemo(() => new TimeAgo("es-ES"), []);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.post("/api/chats", {
        usuario1id: user?.usuarioid,
        usuario2id: userID,
      }, {
        headers: {
          'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
        }
      });
      setChatID(response.data.data.chatid);
      setConversations([]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [userID,setConversations]);

  useEffect(() => {
    if (userID) {
      fetchMessages();
    }
  }, [userID, fetchMessages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversations]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() && chatID) {
      const newMessage: Message = {
        chatid: chatID,
        vchcontenido: message,
        usuarioid: user?.usuarioid,
        created_at: new Date(),
      };
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji);
    setShowEmojis(false);
  };

  return (
    <section className="h-[calc(100vh-200px)]">
      <div className="h-full w-full flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-start">
            <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={onBack}>
              <ArrowLeft size={20} />
            </Button>
            <Avatar className="w-10 h-10 mr-4">
              <AvatarImage src={image} />
              <AvatarFallback>{nameUser === '' ? 'U' : nameUser}</AvatarFallback>
            </Avatar>
            <CardTitle>{nameUser !== undefined ? nameUser : 'Selecciona un chat'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            {conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="p-4 text-gray-500 dark:text-gray-300 text-center text-sm">No hay mensajes en esta conversación.</p>
              </div>
            ) : (
              conversations.map((msg, index) => (
                <div key={`${msg.usuarioid}-${index}`} className={`flex my-4 ${msg.usuarioid === user?.usuarioid ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-full sm:max-w-[calc(80%)] flex ${msg.usuarioid === user?.usuarioid ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={msg.usuarioid === user?.usuarioid ? user?.vchimage : image} />
                      <AvatarFallback>{msg.usuarioid === user?.usuarioid ? 'U' : 'N'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className={`mx-2 ${msg.usuarioid === user?.usuarioid ? 'bg-blue-400 text-primary-foreground' : 'bg-muted'} rounded-lg p-2`}>
                        <p className="text-sm">{msg.vchcontenido}</p>
                      </div>
                      <p className="px-2 text-xs text-muted-foreground mt-1">
                        {timeAgo.format(new Date(msg.created_at))}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t relative">
          <form onSubmit={sendMessage} className="flex dark:bg-gray-950 border-gray-800">
            <HoverCard>
              <HoverCardTrigger className="dark:bg-blue-500 bg-blue-400 text-white p-2 rounded-lg mr-2">
                <StickerIcon size={18} />
              </HoverCardTrigger>
              <HoverCardContent>
                {emojiList.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-2xl p-1"
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </HoverCardContent>
            </HoverCard>
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-grow mr-2"
            />
            <Button type="submit" className="ml-2 p-2 bg-green-500 text-white rounded-lg">
              <SendIcon size={20} />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}