'use client';

import Sidebar, { SidebarItem } from "@/components/Navegate";
import { Box, Button, AppBar, IconButton, Toolbar, Typography, CssBaseline } from "@mui/material";
import { BarChart3, Boxes, ChevronFirst, ChevronLast, Home, LayoutDashboard, LifeBuoy, MenuIcon, Package, Receipt, Settings, Turtle, UserCircle } from "lucide-react";
import AddHomeOutlinedIcon from '@mui/icons-material/AddHomeOutlined';
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { rolesMapping } from "@/utils/constants";
// Alerts and notifications
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface UserProfile {
    vchname: string;
    vchpaternalsurname: string;
    vchmaternalsurname: string;
    vchemail: string;
    vchimage: string;
    usuarioid: number;
    sessionid: number;
    dtbirthdate: string;
    bnverified: boolean;
    bnstatus: boolean;
    roleid: number;
}

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
                        <div className="flex items-center">
                            <Home size={20} />
                            <Typography
                                variant="h6"
                                color="inherit"
                                component="div"
                                className="ml-2"
                            >
                                Roomfinder
                            </Typography>
                        </div>
                    </Toolbar>
                </AppBar>
                <div
                    className="flex flex-1"
                >
                    <Sidebar expanded={expanded} onResize={toggleSidebar}>
                        <SidebarItem
                            icon={<LayoutDashboard size={20} />}
                            text="Panel"
                            url="/dashboard/home"
                            alert
                        />
                        <SidebarItem icon={<BarChart3 size={20} />} text="Estadisticas" url="/dashboard/statistics" alert />
                        <SidebarItem icon={<UserCircle size={20} />} text="Perfil" url="/dashboard/profile" />
                        <SidebarItem icon={<Boxes size={20} />} text="Inventario" url="/dashboard/inventory" />
                        {// Show option only for lessors
                            roleName === 'Arrendador' && (
                                <>
                                    <SidebarItem icon={<AddHomeOutlinedIcon style={{fontSize: 20}}/>} text="Publicar" url="/dashboard/publish" />
                                    <SidebarItem icon={<Package size={20} />} text="Historial" url="/dashboard/orders" />
                                </>
                            )
                        }
                        <SidebarItem icon={<Receipt size={20} />} text="Pagos" url="/dashboard/billings" />
                        <hr className="my-3 border-gray-300 dark:border-gray-800" />
                        <SidebarItem icon={<Settings size={20} />} text="Configuraciones" url="/dashboard/settings" />
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