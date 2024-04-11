import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Link as NLink } from "@nextui-org/react";
import DropdownUser from "./dropdown";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from 'next/navigation'

function Navbar({
    isOpen,
    toggle,
}: {
    isOpen: boolean,
    toggle: () => void;
}) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [buttonSize, setButtonSize] = useState<"sm" | "md" | "lg" | undefined>("sm");

    // useEffect(() => {
    //     console.log(buttonSize)
    //     const updateSize = () => {
    //         console.log(window.innerWidth)
    //         setButtonSize(window.innerWidth < 1024 ? "sm" : "sm");
    //         console.log(buttonSize)
    //     };
    //     window.addEventListener("resize", updateSize);
    //     updateSize();

    //     return () => window.removeEventListener("resize", updateSize);
    // }, []);

    return (
        <>
            <nav className="w-full bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-900 sticky top-0 z-50">
                <div className="container mx-auto p-4 sm:py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <Image className="w-8 h-8 mr-2" width={32} height={32} src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" priority={true} alt="logo" />
                            <h1 className="dark:text-gray-300 dark:hover:text-white text-2xl font-semibold">
                                RoomFinder
                            </h1>
                        </Link>
                        <div className="md:hidden flex gap-3">
                            {session ? (
                                <DropdownUser />
                            ) : (
                                <Button as={NLink} href="/register" size="sm" color="primary" variant="bordered" className="font-normal">
                                    Registrar
                                </Button>
                            )
                            }
                            <button
                                onClick={toggle}
                                className='dark:text-gray-300 text-xl dark:hover:text-white'
                            >
                                <svg
                                    className='w-6 h-6'
                                    aria-hidden="true"
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <div className="hidden md:flex items-center space-x-6 text-sm">
                            <Link href="/" className={`block lg:inline-block dark:hover:text-white ${pathname === '/' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                Inicio
                            </Link>
                            <Link href="/propiedades" className={`block lg:inline-block dark:hover:text-white ${pathname === '/propiedades' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                Propiedades
                            </Link>
                            <Link href="/arrendadores" className={`block lg:inline-block dark:hover:text-white ${pathname === '/arrendadores' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                Arrendadores
                            </Link>
                            {session ? (
                                <DropdownUser />
                            ) : (
                                <div className="hidden md:flex items-center space-x-2">
                                    <Button as={NLink} href="/register" size={buttonSize} color="primary" variant="bordered" className="font-normal">
                                        Registrar
                                    </Button>
                                    <Button as={NLink} href="/login" size={buttonSize} color="primary" variant="solid" className="font-normal">
                                        Iniciar sesión
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Edit before... */}
                    {
                        isOpen && (
                            <div className="md:hidden text-sm mt-2 transition-opacity">
                                <ul>
                                    <li className={`block mt-2 py-2 pl-3 pr-4 text-gray-900 rounded dark:hover:bg-gray-800 ${pathname === '/' ? 'dark:bg-gray-800' : ''}`}>
                                        <Link href="/" className={`block lg:inline-block dark:hover:text-white ${pathname === '/' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                            Inicio
                                        </Link>
                                    </li>
                                    <li className={`block mt-2 py-2 pl-3 pr-4 text-gray-900 rounded dark:hover:bg-gray-800 ${pathname === '/propiedades' ? 'dark:bg-gray-800' : ''}`}>
                                        <Link href="/propiedades" className={`block lg:inline-block dark:hover:text-white ${pathname === '/propiedades' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                            Propiedades
                                        </Link>
                                    </li>
                                    <li className={`block mt-2 py-2 pl-3 pr-4 text-gray-900 rounded dark:hover:bg-gray-800 ${pathname === '/arrendadores' ? 'dark:bg-gray-800' : ''}`}>
                                        <Link href="/arrendadores" className={`block lg:inline-block dark:hover:text-white ${pathname === '/arrendadores' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                            Arrendadores
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )
                    }
                </div>
            </nav>
        </>
    );
}

export default Navbar;