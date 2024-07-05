'use client';

import { rolesMapping } from "@/utils/constants";
import { Divider, Image } from "@nextui-org/react";
import { useSession } from "next-auth/react";
// Estilos de algunos componentes
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import ShowData from "./showdata";

export default function Profile() {
    const { data: session } = useSession();
    const user = session?.user;
    // Estructura de datos predeterminada
    const defaultUserData = {
        vchname: '',
        vchpaternalsurname: '',
        vchmaternalsurname: '',
        vchemail: '',
        vchphone: '',
        vchstreet: '',
        vchimage: '',
    };

    // Sobrescribir los valores predeterminados con los del usuario (si existen)
    const userData = {
        ...defaultUserData,
        ...(user ?? {}),
    };

    return (
        <>
            <PerfectScrollbar>
                <div className="h-full max-w-screen-2xl mx-auto">
                    <div className="container mx-auto p-2">
                        <h1 className="font-bold text-3xl dark:text-gray-200 p-2">Perfil de Usuario</h1>
                        <Divider className='bg-neutral-400 dark:bg-gray-500' />
                        <ShowData userData={userData} />
                    </div>
                </div>
            </PerfectScrollbar>
        </>
    );
}