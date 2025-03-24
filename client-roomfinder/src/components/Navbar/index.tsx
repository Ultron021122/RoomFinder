'use client';
import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";

const excludedRoutes = [
    '/user/messages',
    '/signup',
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/help',
    '/dashboard/publish',
    '/dashboard/messages',
    '/dashboard/properties',
    '/dashboard/chats',
    '/dashboard/inmuebles',
    '/dashboard/home',
    '/dashboard/manage',
    '/dashboard/users',
    '/dashboard/history',
    '/test',
    '/checkout'
];

const dynamicRoutesPattern = /^\/dashboard\/propertyDetails\/\d+$/;  // Expresión regular para la ruta dinámica

function Navigate() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const shouldShowNavbar = !excludedRoutes.includes(pathname) && !dynamicRoutesPattern.test(pathname);
    const toggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            {shouldShowNavbar && <Navbar isOpen={isOpen} toggle={toggle} />}
        </>
    );
}

export default Navigate;