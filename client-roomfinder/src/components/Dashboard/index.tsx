'use client';

import Sidebar, { SidebarItem } from "@/components/Navegate";
import { Box, Button, AppBar, IconButton, Toolbar, Typography, CssBaseline } from "@mui/material";
import { BarChart3, Boxes, ChevronFirst, ChevronLast, Home, LayoutDashboard, LifeBuoy, MenuIcon, Package, Receipt, Settings, Turtle, UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [expanded, setExpanded] = useState(true);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const { data: session } = useSession();
    const pathname = usePathname();

    // Update the window width state
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);

            // Clean up the event listener
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const toggleSidebar = useCallback(() => {
        if (typeof window !== 'undefined') {
            setExpanded(window.innerWidth > 640);
        }
    }, []);

    return (
        <PerfectScrollbar>
            <div className="flex flex-col h-[100vh]">
                <AppBar component="nav" position="static" className="bg-gray-300 text-neutral-950 dark:bg-primary dark:text-gray-100">
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
                                RoomFinder
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
                            text="Dashboard"
                            url="/dashboard/home"
                            alert
                        />
                        <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" url="/dashboard/statistics" alert />
                        <SidebarItem icon={<UserCircle size={20} />} text="Perfil" url="/dashboard/profile" />
                        <SidebarItem icon={<Boxes size={20} />} text="Inventory" url="/dashboard/inventory" />
                        <SidebarItem icon={<Package size={20} />} text="Historial" url="/dashboard/orders" />
                        <SidebarItem icon={<Receipt size={20} />} text="Billings" url="/dashboard/billings" />
                        <hr className="my-3 border-gray-300 dark:border-gray-800" />
                        <SidebarItem icon={<Settings size={20} />} text="Settings" url="/dashboard/settings" />
                        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" url="/dashboard/help" alert />
                    </Sidebar>
                    {/* Render the component main only if the display is major than 640px */
                        windowWidth > 640 || !expanded ? (
                            <main className="flex-1 p-4">
                                {children}
                            </main>
                        ) : (
                            <div className="opacity-50 dark:bg-black w-full h-full">

                            </div>
                        )
                    }
                </div>
            </div>
        </PerfectScrollbar>
    );
}