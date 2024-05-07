'use client';
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import "../css/message.css";

const socket = io("http://localhost:1234");

interface Message {
    body: string;
    from: string;
    createdAt: string;
}

export default function MessageComponent() {
    const [conversations, setConversations] = useState<Message[]>([]);
    const [message, setMessage] = useState("");

    const receiveMessage = (message: Message) => {
        setConversations((prevMessages) => [...prevMessages, message]);
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
            createdAt: Date.now().toString(),
        };
        setConversations(state => [newMessage, ...state]);
        setMessage("");
        socket.emit("message", newMessage.body);
    };

    return (
        <>
            <div className="h-screen bg-zinc-800 text-white">
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

                    {conversations.map((message, index) => (
                        <>
                            <div className="message" key={index}>
                                <div className="messageTop">
                                    {/* <Image
                                        src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                        alt="Picture of the author"
                                    />                                  */}
                                    <p className="messageText">{message.body}</p>
                                </div>
                                <div className="messageBottom">{message.createdAt}</div>
                            </div>
                        </>
                    ))}
                </form>
            </div>
        </>
    );
}