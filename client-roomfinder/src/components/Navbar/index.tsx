'use client';
import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";

const excludedRoutes = [
    '/user/messages',
    '/signup',
    '/propiedades',
    '/dashboard/profile',
    '/dashboard/help',
    '/dashboard/publish',
    '/dashboard/messages',
    '/dashboard/properties',
    '/admin',
    '/prueba'];

function Navigate() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const shouldShowNavbar = !excludedRoutes.includes(pathname);
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