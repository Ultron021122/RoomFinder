'use client';

import Sidebar, { SidebarItem } from "@/components/Navegate";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { rolesMapping } from "@/utils/constants";
import 'react-perfect-scrollbar/dist/css/styles.css';
import { LayoutDashboard, Mail, MenuIcon, UserCircle, Folder, SlidersHorizontal, MoreVerticalIcon, Users, Plus, HousePlus, History, CreditCard, NotebookIcon, ClipboardList, Search } from "lucide-react";
import { HomeIcon } from "@radix-ui/react-icons";
import { UserProfile } from "@/utils/interfaces";
import Link from "next/link";
import useSidebarStore from "@/stores/useSideStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { expanded, toggleSidebar } = useSidebarStore();
    const [windowWidth, setWindowWidth] = useState(0);
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = session?.user as UserProfile;

    const dropdownItems = [
        { text: 'Perfil', onClick: () => router.push('/dashboard/profile'), color: 'primary' },
        { text: 'Configuraciones', onClick: () => router.push('/dashboard/settings'), color: 'primary' },
        { text: 'Cerrar sesión ', onClick: async () => { await signOut({
            redirect: true,
            callbackUrl: '/users/login'
        }) }, color: 'error' },
    ];

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/users/login');
        }
    }, [status]);

    const roleName = rolesMapping[user?.roleid] || 'Desconocido';
    const handleSidebarItemClick = () => {
        if (windowWidth <= 640 && expanded) {
            toggleSidebar();
        }
    };

    return (
        <div className="flex flex-col h-[100vh]">
            <header className="fixed z-40 w-full text-black dark:text-white bg-white border-b border-gray-220 dark:bg-gray-950 dark:border-gray-900 max-w-screen-2xl">
                <div className="max-w-screen-2xl flex items-center justify-start p-4">
                    <Button
                        variant="ghost"
                        className="p-2"
                        onClick={toggleSidebar}
                    >
                        <MenuIcon />
                    </Button>
                    <Link href="/" className="flex items-center ml-2">
                        <Image
                            src="/utils/rf8.png"
                            alt="RoomFinder"
                            priority
                            width={128}
                            height={32}
                            sizes="100vw"
                            className="dark:hidden filter drop-shadow-2xl"
                        />
                        <Image
                            src="/utils/rf3.png"
                            alt="RoomFinder"
                            priority
                            width={128}
                            height={32}
                            sizes="100vw"
                            className="hidden dark:block"
                        />
                    </Link>
                </div>
            </header>
            <div className="flex flex-1 mt-16 w-full">
                <Sidebar expanded={expanded}>
                    <SidebarItem
                        icon={<LayoutDashboard size={22} />}
                        text="Inicio"
                        url="/dashboard/home"
                        onClickSidebar={handleSidebarItemClick}
                    />
                    <SidebarItem
                        icon={<Search className="w-[22px] h-[22px]" />}
                        text="Inmuebles"
                        url="/dashboard/inmuebles"
                        onClickSidebar={handleSidebarItemClick}
                    />
                    <SidebarItem
                        icon={<Mail size={22} />}
                        text="Mensajes"
                        url="/dashboard/messages"
                        alert
                        onClickSidebar={handleSidebarItemClick}
                    />
                    {/* {roleName === 'Estudiante' && (
                        <> */}
                    <SidebarItem
                        icon={<History size={22} />}
                        text="Historial"
                        url="/dashboard/history"
                        onClickSidebar={handleSidebarItemClick}
                    />
                    <SidebarItem
                        icon={<CreditCard size={22} />}
                        text="Pagos"
                        url="/dashboard/payments"
                        onClickSidebar={handleSidebarItemClick}
                    />
                    <SidebarItem
                        icon={<NotebookIcon size={22} />}
                        text="Rentas"
                        url="/dashboard/rentals"
                        onClickSidebar={handleSidebarItemClick}
                    />
                    {/* </>
                    )} */}
                    {roleName === 'Arrendador' && (
                        <>
                            <SidebarItem
                                icon={<Folder size={22} />}
                                text="Propiedades"
                                url="/dashboard/properties"
                                onClickSidebar={handleSidebarItemClick}
                            />
                            <SidebarItem
                                icon={<HomeIcon className="w-[22px] h-[22px]" />}
                                text="Publicar"
                                url="/dashboard/publish"
                                onClickSidebar={handleSidebarItemClick}
                            />
                            <SidebarItem
                                icon={<Users className="w-[22px] h-[22px]" />}
                                text="Usuarios"
                                url="/dashboard/users"
                                onClickSidebar={handleSidebarItemClick}
                            />
                            <SidebarItem
                                icon={<ClipboardList size={22} />}
                                text="Solicitudes"
                                url="/dashboard/request"
                                alert
                                onClickSidebar={handleSidebarItemClick}
                            />
                        </>
                    )}
                    <hr className="my-2 border-gray-300 dark:border-gray-800" />
                    <SidebarItem
                        icon={<UserCircle size={22} />}
                        text="Perfil"
                        url="/dashboard/profile"
                        onClickSidebar={handleSidebarItemClick}
                    />
                    <SidebarItem
                        icon={<SlidersHorizontal size={22} />}
                        text="Ajustes"
                        url="/dashboard/settings"
                        onClickSidebar={handleSidebarItemClick}
                    />
                    <SidebarItem
                        icon={<MoreVerticalIcon size={22} />}
                        vchname={user?.vchname}
                        vchpaternalsurname={user?.vchpaternalsurname}
                        vchmaternalsurname={user?.vchmaternalsurname}
                        url="/dashboard"
                        onClickSidebar={handleSidebarItemClick}
                        dropdownItems={dropdownItems}
                        // color='active'
                        // alert
                    />
                </Sidebar>
                <main className={`flex-1 pt-4 ${windowWidth <= 640 && expanded ? 'opacity-50 dark:bg-gray-950 w-full h-full' : ''}`}>
                    <section className={`${windowWidth <= 640 && expanded && 'hidden'}`}>
                        <ScrollArea className="w-full h-[calc(100vh-100px)] px-2 max-w-sm sm:max-w-[450px] md:max-w-[40rem]  lg:max-w-[90rem]">
                            {children}
                        </ScrollArea>
                    </section>
                </main>
            </div>
        </div>
    );
}