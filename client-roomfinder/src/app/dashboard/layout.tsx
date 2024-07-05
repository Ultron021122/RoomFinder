'use client';

import Sidebar, { SidebarItem } from "@/components/Navegate";
import { Box, Button, AppBar, IconButton, Toolbar, Typography, CssBaseline } from "@mui/material";
import { BarChart3, Boxes, ChevronFirst, ChevronLast, Home, LayoutDashboard, LifeBuoy, MenuIcon, Package, Receipt, Settings, Turtle, UserCircle } from "lucide-react";
import React, { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [expanded, setExpanded] = useState(true);
    return (
        <div className="flex flex-col h-[100vh]">
            <AppBar component="nav" position="static" className="bg-indigo-800">
                <Toolbar variant="dense">
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setExpanded((expanded) => !expanded)}
                    >
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
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
            <div className="flex flex-1">
                <Sidebar expanded={expanded}>
                    <SidebarItem
                        icon={<LayoutDashboard size={20} />}
                        text="Dashboard"
                        active
                        alert
                    />
                    <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" alert />
                    <SidebarItem icon={<UserCircle size={20} />} text="Users" />
                    <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
                    <SidebarItem icon={<Package size={20} />} text="Orders" />
                    <SidebarItem icon={<Receipt size={20} />} text="Billings" />
                    <hr className="my-3 border-gray-300 dark:border-gray-800" />
                    <SidebarItem icon={<Settings size={20} />} text="Settings" />
                    <SidebarItem icon={<LifeBuoy size={20} />} text="Help" alert />
                </Sidebar>
                <main className="flex-1 p-4">{children}</main>
            </div>
        </div>
    );
}