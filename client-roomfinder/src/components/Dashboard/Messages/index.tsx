"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SendIcon, RocketIcon } from "lucide-react";
import { User, UserProfile } from "@/utils/interfaces";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import MessageComponent from "./messages";

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
  const { data: session } = useSession();
  const user = session?.user as UserProfile;
  const [users, setUsers] = useState<UserResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorSystem, setErrorSystem] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setErrorSystem(null);

        let route = '/api/users/all';
        if (user?.roleid === 1) { route = '/api/users/lessor'; }
        const response = await axios.get<UserResponse>(route);
        setIsLoading(false);

        if (response.status === 200) {
          setUsers(response.data);
        } else {
          setErrorSystem('Error al cargar los usuarios');
        }
      } catch (error) {
        setErrorSystem('Ocurrió un error. Intente más tarde');
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
        <div className="flex flex-col md:flex-row h-full">
          {/* Users Box */}
          <div className="w-full md:w-1/4 border-r border-gray-300 dark:border-gray-800 overflow-y-auto custom-scrollbar">
            <div className="p-4 flex items-center justify-between border-b border-gray-300 dark:border-gray-800">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Chats</h4>
              <div className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600">
                <SendIcon size={24} />
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center h-12 justify-center">
                <Spinner />
              </div>
            ) : !users ? (
              <div>
                <p className="p-4 text-gray-500 dark:text-gray-300">No hay chats disponibles.</p>
              </div>
            ) : (
              <div>
                {users.data.map((user) => (
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
                      <span className="text-sm text-gray-800 dark:text-gray-400 hover:text-gray-200">Last message ...</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Other Box */}
          <div className={`w-full md:w-3/4 flex flex-col ${selectedUser ? '' : 'items-center justify-center'}`}>
            {selectedUser ? (
              <MessageComponent userID={selectedUser} className='w-full' />
            ) : (
              <div className="flex flex-col items-center justify-center h-full overflow-y-auto custom-scrollbar">
                <RocketIcon size={64} className="text-gray-500 dark:text-gray-300" />
                <div>
                  <p className="p-4 text-gray-400">Únete a una nueva conversación.</p>
                </div>
              </div>
            )}
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
