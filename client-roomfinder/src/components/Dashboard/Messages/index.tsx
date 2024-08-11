"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SendIcon, MessageCircle, RocketIcon } from "lucide-react";

// Datos de ejemplo con nombres e imágenes
const chats = [
    { chatid: 1, name: "Alice", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600" },
    { chatid: 2, name: "Bob", image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=600" },
    { chatid: 3, name: "Charlie", image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?q=80&w=600" },
    // Agrega más chats según sea necesario
];

export default function MessageMainComponent() {
    return (
        <>
            <section className="h-[calc(100vh-150px)] flex flex-col bg-white dark:bg-gray-950">
                <div className="flex h-full">
                    {/* Users Box */}
                    <div className="w-1/4 border-r border-gray-300 dark:border-gray-800 overflow-y-auto custom-scrollbar">
                        <div className="p-4 flex items-center justify-between border-b border-gray-300 dark:border-gray-800">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Chats</h4>
                            <div className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600">
                                <SendIcon size={24} />
                            </div>
                        </div>
                        <div>
                            {chats.length === 0 ? (
                                <p className="p-4 text-gray-500 dark:text-gray-300">No hay chats disponibles.</p>
                            ) : (
                                chats.map((chat) => (
                                    <div
                                        key={chat.chatid}
                                        className="flex items-center p-4 cursor-pointer bg-gray-300 dark:bg-gray-950 hover:bg-primary-500"
                                    >
                                        <img
                                            src={chat.image}
                                            alt={chat.name}
                                            className="w-12 h-12 rounded-full object-cover mr-4"
                                        />
                                        <div className="flex flex-col">
                                            <h5 className="font-semibold text-gray-900 dark:text-gray-300 hover:text-white">{chat.name}</h5>
                                            <span className="text-small text-gray-800 dark:text-gray-400 hover:text-gray-200">Last message ...</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Other Box */}
                    <div className="w-3/4 flex flex-col">
                        <div className="flex flex-col items-center justify-center h-full overflow-y-auto custom-scrollbar">
                            <RocketIcon size={64} className="text-gray-500 dark:text-gray-300" />
                            <div>
                                <p className="p-4 text-gray-400">Únete a una nueva conversación.</p>
                            </div>
                        </div>
                    </div>
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
