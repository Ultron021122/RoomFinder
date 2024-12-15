'use client';

import Sidebar, { SidebarItem } from "@/components/Navegate";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import AddHomeOutlinedIcon from '@mui/icons-material/AddHomeOutlined';
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { rolesMapping } from "@/utils/constants";
// Alerts and notifications
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
/* Iconos */
import { GraduationCapIcon, LayoutDashboard, Mail, MenuIcon, UserCircle, Folder, SlidersHorizontal, MoreVerticalIcon } from "lucide-react";
import { HomeIcon } from "@radix-ui/react-icons"
import { UserProfile } from "@/utils/interfaces";
import Link from "next/link";
import useSidebarStore from "@/stores/useSideStore";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { expanded, toggleSidebar } = useSidebarStore();
    const [windowWidth, setWindowWidth] = useState(0);
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = session?.user as UserProfile;

    const dropdownItems = [
        { text: 'Perfil', onClick: () => router.push('/dashboard/profile'), color: 'primary' },
        { text: 'Configuraciones', onClick: () => router.push('/dashboard/settings'), color: 'primary' },
        { text: 'Cerrar sesión ', onClick: () => signOut(), color: 'error' },
    ];

    // Update the window width state
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Initialize window width on client
        handleResize();

        window.addEventListener('resize', handleResize);

        // Clean up the event listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Redirect to login page if the user is not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/users/login');
        }
    }, [status]);

    const roleName = rolesMapping[user?.roleid] || 'Desconocido';
    const handleSidebarItemClick = () => {
        if (windowWidth <= 640 && expanded) {
            toggleSidebar(); // Cierra el sidebar
        }
    };

    return (
        <PerfectScrollbar>
            <div className="flex flex-col h-[100vh]">
                <AppBar
                    component="nav"
                    position="static"
                    className="w-full max-w-full text-black dark:text-white bg-white border-b border-gray-220 dark:bg-gray-900 dark:border-gray-900"
                    sx={{
                        bgcolor: (theme) => theme.palette.background.paper,
                        color: (theme) => theme.palette.text.primary,
                        zIndex: (theme) => theme.zIndex.drawer + 1
                    }}
                >
                    <Toolbar variant="regular">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleSidebar}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/utils/5.png" // Imagen para modo claro
                                alt="RoomFinder"
                                width={162}
                                height={32}
                                className="dark:hidden w-40 h-auto" // Ocultar en modo oscuro
                            />
                            <Image
                                src="/utils/logo-dark.png" // Imagen para modo oscuro
                                alt="RoomFinder"
                                width={162}
                                height={32}
                                className="hidden dark:block w-40 h-auto" // Ocultar en modo claro
                            />
                            {/* <GraduationCapIcon size={32} />
                            <h1 className="ml-2 font-sans dark:text-gray-100 dark:hover:text-white text-2xl font-semibold">
                                RoomFinder
                            </h1> */}
                        </Link>
                    </Toolbar>
                </AppBar>
                <div
                    className="flex flex-1"
                >
                    {/* Sidebar */}
                    <Sidebar expanded={expanded}>
                        <SidebarItem
                            icon={<LayoutDashboard size={22} />}
                            text="Inicio"
                            url="/dashboard/home"
                            onClickSidebar={handleSidebarItemClick}
                        />
                        <SidebarItem
                            icon={<HomeIcon className="w-[22px] h-[22px]" />}
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
                        {// optiones para arrendadores
                            roleName === 'Arrendador' && (
                                <>
                                    <SidebarItem
                                        icon={<Folder size={22} />}
                                        text="Administrar"
                                        url="/dashboard/manage"
                                        alert
                                        onClickSidebar={handleSidebarItemClick}
                                    />
                                    <SidebarItem
                                        icon={<AddHomeOutlinedIcon style={{ fontSize: 22 }} />}
                                        text="Publicar"
                                        url="/dashboard/publish"
                                        onClickSidebar={handleSidebarItemClick}
                                    />
                                </>
                            )
                        }
                        <hr className="my-2 border-gray-300 dark:border-gray-800" /> {/* se  pueden eliminar estas opciones del sideBar */}
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
                            url="/dashboard/profile"
                            onClickSidebar={handleSidebarItemClick}
                            dropdownItems={dropdownItems}
                            color='active'
                            alert
                        />
                    </Sidebar>
                    <main className={`flex-1 px-2 pt-4 ${windowWidth <= 640 && expanded ? 'opacity-50 dark:bg-gray-950 w-full h-full' : ''}`}>
                        <section className={`${windowWidth <= 640 && expanded && 'hidden'}`}>
                            {children}
                        </section>
                    </main>
                </div>
            </div>
        </PerfectScrollbar>
    );
}