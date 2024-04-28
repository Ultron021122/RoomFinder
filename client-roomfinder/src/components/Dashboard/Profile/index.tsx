'use client';

import { Divider, Image } from "@nextui-org/react";
import { useSession } from "next-auth/react";
// Estilos de algunos componentes
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

export default function Profile() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <>
            <PerfectScrollbar>
                <div className="h-[calc(100vh-73px)] max-w-screen-2xl mx-auto">
                    <div className="container mx-auto p-2">
                        <h1 className="font-bold text-3xl dark:text-gray-200 p-2">Perfil de Usuario</h1>
                        <Divider className='bg-neutral-400 dark:bg-gray-500 my-2' />
                        <div className="flex flex-wrap justify-center lg:justify-normal gap-5 mt-2">
                            <Image
                                src={`${(user as any)?.image}`}
                                property="user avatar"
                                alt="User avatar"
                                className="w-auto h-auto max-h-96 rounded-full"
                            />
                            <div className="p-2">
                                <h2 className="font-bold text-3xl dark:text-gray-200">{user?.name + ' ' + (user as any)?.last_name}</h2>
                                <span className="text-neutral-800 dark:text-gray-300 text-small">{(user as any)?.type_user}</span>
                                <div className="space-y-1 my-3">
                                    <p className="dark:text-gray-400">
                                        <strong>Nombre:</strong> {user?.name}
                                    </p>
                                    <p className="dark:text-gray-400">
                                        <strong>Apellidos:</strong> {(user as any)?.last_name}
                                    </p>
                                    <p className="dark:text-gray-400">
                                        <strong>Email:</strong> {user?.email}
                                    </p>
                                    <p className="dark:text-gray-400">
                                        <strong>Telefono:</strong> {(user as any)?.phone}
                                    </p>
                                    <p className="dark:text-gray-400">
                                        <strong>Calle:</strong> {(user as any)?.street}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PerfectScrollbar>
        </>
    );
}