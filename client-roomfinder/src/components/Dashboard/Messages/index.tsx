"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SendIcon, MessageCircle, RocketIcon } from "lucide-react";
import { User } from "@/utils/interfaces";
import axios from "axios";
import { Spinner } from "@nextui-org/react";

// Datos de ejemplo con nombres e imágenes
const chats = [
    { usuarioid: 1, vchname: "Alice", vchimage: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600" },
    { usuarioid: 2, vchname: "Bob", vchimage: "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=600" },
    { usuarioid: 3, vchname: "Charlie", vchimage: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?q=80&w=600" },
    // Agrega más chats según sea necesario
];

interface Chat {
    chatid: number;
    usuario1id: number;
    usuario2id: number;
    created_at: Date;
}

interface UserResponse {
    data: User[];
}


export default function MessageMainComponent() {
    const [users, setUsers] = useState<UserResponse | null>(null);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    useEffect(() => {
        (
            async () => {
                try {
                    setIsLoading(true);
                    setErrorSystem(null);
                    const response = await axios.get<UserResponse>('/api/users/all');
                    setIsLoading(false);
                    console.log("Data: ", response.data)
                    if (response.status === 200) {
                        setUsers(response.data);
                    } else {
                        setErrorSystem('Error al cargar los usuarios');
                    }
                } catch (error) {
                    setErrorSystem('Ocurrio un error. Intente mas tarde');
                } finally {
                    setIsLoading(false);
                }
            })();
    }, []);

    const handleUserClick = (user: User) => {
        setSelectedUser(user.usuarioid);

    }

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
                        {isLoading ?
                            <Spinner />
                            :
                            (
                                users ? (
                                    <div>
                                        <p className="p-4 text-gray-500 dark:text-gray-300">No hay chats disponibles.</p>
                                    </div>
                                ) : (
                                    <div>
                                        {users.data.map((user, index) => (
                                            <div
                                                key={user.usuarioid}
                                                onClick={() => handleUserClick(user)}
                                                className="flex items-center p-4 cursor-pointer bg-gray-300 dark:bg-gray-950 hover:bg-primary-500"
                                            >
                                                <img
                                                    src={user.vchimage}
                                                    alt={user.vchname}
                                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                                />
                                                <div className="flex flex-col">
                                                    <h5 className="font-semibold text-gray-900 dark:text-gray-300 hover:text-white">{user.vchname}</h5>
                                                    <span className="text-small text-gray-800 dark:text-gray-400 hover:text-gray-200">Last message ...</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )
                        }
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
