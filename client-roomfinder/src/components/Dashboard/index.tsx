'use client';

import Sidebar, { SidebarItem } from "@/components/Navegate";
import { Box, Button, AppBar, IconButton, Toolbar, Typography, CssBaseline } from "@mui/material";
import AddHomeOutlinedIcon from '@mui/icons-material/AddHomeOutlined';
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { rolesMapping } from "@/utils/constants";
// Alerts and notifications
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
/* Iconos */
import { GraduationCapIcon, Home, LayoutDashboard, LifeBuoy, Mail, MenuIcon, Settings, UserCircle, LogOut } from "lucide-react";
import { UserProfile } from "@/utils/interfaces";
import Link from "next/link";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [expanded, setExpanded] = useState(true);
    const [windowWidth, setWindowWidth] = useState(0);
    const { data: session } = useSession();
    const user = session?.user as UserProfile;
    const pathname = usePathname();

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

    const toggleSidebar = useCallback(() => {
        setExpanded(windowWidth > 640);
    }, [windowWidth]);

    const roleName = rolesMapping[user?.roleid] || 'Desconocido';

    return (
        <PerfectScrollbar>
            <div className="flex flex-col h-[100vh]">
                <AppBar component="nav" position="static" className="bg-white text-neutral-950 dark:bg-primary dark:text-gray-100">
                    <Toolbar variant="dense">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setExpanded((expanded) => !expanded)}
                        >
                            <MenuIcon />
                            {/*
                        {!expanded ? <ChevronFirst /> : <ChevronLast />
                        */}
                        </IconButton>
                        <Link href="/" className="flex items-center">
                            <GraduationCapIcon size={25} />
                            <h1 className="ml-1 text-2xl font-semibold">
                                Roomfinder
                            </h1>
                        </Link>
                    </Toolbar>
                </AppBar>
                <div
                    className="flex flex-1"
                >
                    <Sidebar expanded={expanded} onResize={toggleSidebar}>
                        <SidebarItem icon={<LayoutDashboard size={20} />} text="Inicio" url="/dashboard/home" />
                        <SidebarItem icon={<Home size={20} />} text="Inmuebles" url="/dashboard/inmuebles" />
                        <SidebarItem icon={<Mail size={20} />} text="Mensajes" url="/dashboard/messages" />
                        <SidebarItem icon={<UserCircle size={20} />} text="Perfil" url="/dashboard/profile" />
                        {// optiones para arrendadores
                            roleName === 'Arrendador' && (
                                <>
                                    <SidebarItem icon={<AddHomeOutlinedIcon style={{ fontSize: 20 }} />} text="Publicar" url="/dashboard/publish" />
                                </>
                            )
                        }
                        <hr className="my-3 border-gray-300 dark:border-gray-800" /> {/* se  pueden eliminar estas opciones del sideBar */}
                        <SidebarItem icon={<Settings size={20} />} text="Ajustes" url="/dashboard/settings" />
                        <SidebarItem icon={<LifeBuoy size={20} />} text="Ayuda" url="/dashboard/help" alert />
                    </Sidebar>
                    <main className={`flex-1 p-4 ${windowWidth <= 640 && expanded ? 'opacity-50 dark:bg-gray-950 w-full h-full' : ''}`}>
                        <section className={`${windowWidth <= 640 && expanded && 'hidden'}`}>
                            {children}
                        </section>
                    </main>
                </div>
            </div>
        </PerfectScrollbar>
    );
}