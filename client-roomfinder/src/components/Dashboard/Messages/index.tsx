"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { RocketIcon, MessageSquareText, Search, Mail } from "lucide-react";
import { User, User2, UserList, UserProfile } from "@/utils/interfaces";
import axios from "axios";
import { Avatar, Badge, Spinner } from "@nextui-org/react";
import MessageComponent from "./messages";
import { shortName } from "@/utils/functions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import TimeAgo from "javascript-time-ago";
import es from "javascript-time-ago/locale/es";

TimeAgo.addLocale(es); // Cambiado a addLocale

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
  const timeAgo = new TimeAgo("es-ES");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        setErrorSystem(null);

        let route = (user.roleid === 1 ? '/api/chats/students/' : '/api/chats/lessors/') + user.usuarioid;
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
  }, [user?.roleid]);

  const handleUserClick = (user: User2) => {
    setSelectedUser(user.usuarioid2);
    setImageUser(user.vchimage2 || '');
    setNameUser(`${user.vchname2 || ''} ${user.vchpaternalsurname2 || ''} ${user.vchmaternalsurname2 || ''}`);
  };

  const filteredUsers = users ? users.data.filter(user =>
    user.vchname2?.toLowerCase().includes(name.toLowerCase()) ||
    (user.vchpaternalsurname2 + ' ' + user.vchmaternalsurname2).toLowerCase().includes(name.toLowerCase())
  ) : [];

  return (
    <div>
      <section className="h-[calc(100vh-200px)] flex flex-col mr-1">
        <div className="flex flex-col md:flex-row h-full max-w-8xl border rounded-lg overflow-hidden border-stroke bg-white shadow-md dark:bg-gray-950">
          <div className="w-full md:w-1/3 border-r overflow-y-auto custom-scrollbar">
            <div className="p-4 flex items-center justify-between border-b">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Chats</h4>
              <div className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                <Mail size={22} />
              </div>
            </div>
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
            <ScrollArea className="h-[calc(100vh-300px)]">
              {isLoading ? (
                <div className="flex items-center h-12 justify-center">
                  <Spinner />
                </div>
              ) : !users ? (
                <div className="flex items-center p-4">
                  <p className="p-4 text-sm text-gray-500 dark:text-gray-300">No hay chats disponibles.</p>
                </div>
              ) : filteredUsers.length === 0 || (filteredUsers[0].vchname2 === null && filteredUsers.length === 1) ? (
                <div className="flex items-center justify-center p-4">
                  <p className="p-4 text-sm text-gray-500 dark:text-gray-300">No se encontraron resultados.</p>
                </div>
              ) : (
                <div>
                  {filteredUsers.map((user, index) => (
                    <div
                      key={user.usuarioid2}
                      onClick={() => handleUserClick(user)}
                      className="flex items-center p-4 cursor-pointer hover:bg-muted"
                    >
                      <Badge
                        content=""
                        color={user.bnstatus ? "success" : "danger"}
                        shape="circle"
                        placement="bottom-right"
                      >
                        <Avatar radius="full" src={user.vchimage2 || ''} />
                      </Badge>
                      <div className="flex-1 min-w-0 ml-4">
                        <h3 className="text-sm font-semibold truncate">
                          {user.vchname2 ? `${user.vchname2} ${user.vchpaternalsurname2}` : 'Nombre no disponible'}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{user.vchcontenido || 'Sin contenido'}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {user.dtmessage && timeAgo.format(new Date(user.dtmessage))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          <div className={`w-full md:w-2/3 flex flex-col ${selectedUser ? '' : 'items-center justify-center'}`}>
            {selectedUser ? (
              <MessageComponent userID={selectedUser} image={imageUser} nameUser={nameUser} className='w-full' onBack={() => setSelectedUser(null)} />
            ) : (
              <div className={`w-full flex-col items-center justify-center h-full overflow-y-auto custom-scrollbar md:flex hidden`}>
                <div className="max-w-lg w-full space-y-8 text-center">
                  <div className="space-y-4">
                    <div className="relative w-72 h-64 mx-auto">
                      <Image
                        src="/utils/logoIconT.png"
                        alt="Ilustración de búsqueda"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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