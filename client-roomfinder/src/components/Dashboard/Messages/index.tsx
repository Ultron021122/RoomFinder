"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { RocketIcon, MessageSquareText, Search } from "lucide-react";
import { User, UserList, UserProfile } from "@/utils/interfaces";
import axios from "axios";
import { Avatar, Badge, Spinner } from "@nextui-org/react";
import MessageComponent from "./messages";
import { shortName } from "@/utils/functions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Image from "next/image";


export default function MessageMainComponent() {
  const { data: session } = useSession();
  const user = session?.user as UserProfile;
  const [users, setUsers] = useState<UserList | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [imageUser, setImageUser] = useState<string>('');
  const [nameUser, setNameUser] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorSystem, setErrorSystem] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        setErrorSystem(null);

        let route = user.roleid === 1 ? '/api/users/lessor' : '/api/users/student';
        const response = await axios.get<UserList>(route);

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
    };

    fetchUsers();
  }, [user?.roleid]); // Cambié las dependencias aquí


  const handleUserClick = (user: User) => {
    setSelectedUser(user.usuarioid);
    setImageUser(user.vchimage);
    setName(user.vchname);
    setNameUser(user.vchname + ' ' + user.vchpaternalsurname + ' ' + user.vchmaternalsurname);
  }

  const filteredUsers = users ? users.data.filter(user =>
    user.vchname.toLowerCase().includes(name.toLowerCase()) ||
    (user.vchpaternalsurname + ' ' + user.vchmaternalsurname).toLowerCase().includes(name.toLowerCase())
  ) : [];

  return (
    <div>
      <section className="h-[calc(100vh-150px)] flex flex-col">
        <div className="flex flex-col md:flex-row h-full max-w-8xl border rounded-lg overflow-hidden border-stroke bg-white shadow-md dark:bg-gray-950">
          {/* Users Box */}
          <div className="w-full md:w-1/3 border-r overflow-y-auto custom-scrollbar">
            <div className="p-4 flex items-center justify-between border-b">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                Chats
              </h4>
              <div className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600">
                <MessageSquareText size={22} />
              </div>
            </div>
            {/* Busqueda de usuarios */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar chat"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {/* Lista de usuarios */}
            <ScrollArea className="h-[calc(100vh-300px)]">
              {isLoading ? (
                <div className="flex items-center h-12 justify-center">
                  <Spinner />
                </div>
              ) : !users ? (
                <div className="flex items-center p-4">
                  <p className="p-4 text-sm text-gray-500 dark:text-gray-300">No hay chats disponibles.</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center p-4">
                  <p className="p-4 text-sm text-gray-500 dark:text-gray-300">No se encontraron resultados.</p>
                </div>
              ) : (
                <div>
                  {filteredUsers.map((user) => (
                    <div
                      key={user.usuarioid}
                      onClick={() => handleUserClick(user)}
                      className="flex items-center p-4 cursor-pointer hover:bg-muted"
                    >
                      <Badge
                        content=""
                        color={user.bnstatus == true ? "success" : "danger"}
                        shape="circle"
                        placement="bottom-right"
                      >
                        <Avatar
                          radius="full"
                          src={user.vchimage}
                        />
                      </Badge>
                      <div className="flex-1 min-w-0 ml-4">
                        <h3 className="text-sm font-semibold truncate">
                          {user.vchname + ' ' + user.vchpaternalsurname}
                        </h3>
                        {/* Change for last message */}
                        <p className="text-sm text-muted-foreground truncate">{user.bnstatus == true ? 'Activo' : 'Inactivo'}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        20:00pm
                        {/* {usuario.horaUltimoMensaje.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          {/* Other Box */}
          <div className={`w-full md:w-2/3 flex flex-col ${selectedUser ? '' : 'items-center justify-center'}`}>
            {selectedUser ? (
              <MessageComponent userID={selectedUser} name={name} image={imageUser} nameUser={nameUser} bnstatus className='w-full' onBack={() => setSelectedUser(null)} />
            ) : (
              <div className={`w-full flex-col items-center justify-center h-full overflow-y-auto custom-scrollbar md:flex hidden`}>
                {/* <RocketIcon size={64} className="text-gray-500 dark:text-gray-300" /> */}
                <div className="max-w-lg w-full space-y-8 text-center">
                  <div className="space-y-4">
                    <div className="relative w-72 h-64 mx-auto">
                      <Image
                        src="/utils/logoIconT.png"
                        alt="Ilustración de búsqueda"
                        fill
                        className='absolute inset-0 object-cover w-full h-full'
                        priority
                      />
                    </div>
                  </div>
                </div>
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
    </div>
  );
}
