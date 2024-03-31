import React from "react";
import Link from "next/link";
import { useSessionStore } from "@/components/sesion/global";
import { Button, Link as NLink } from "@nextui-org/react";
import DropdownUser from "./dropdown";

const Navbar = ({
    isOpen,
    toggle,
}: {
    isOpen: boolean,
    toggle: () => void;
}): JSX.Element => {

    const { isLoggedIn } = useSessionStore();
    return (
        <>
            <nav className="w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-900">
                <div className="container mx-auto p-4 sm:py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                            <h1 className="dark:text-gray-300 dark:hover:text-white text-2xl font-semibold">
                                RoomFinder
                            </h1>
                        </Link>
                        <div className="md:hidden flex gap-5">
                            {isLoggedIn ? (
                                <DropdownUser />
                            ) : (
                                <Button as={NLink} href="/registrar" color="primary" variant="bordered" className="font-normal">
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
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="block lg:inline-block dark:text-gray-300 dark:hover:text-white">
                                Inicio
                            </Link>
                            <Link href="/propiedades" className="block lg:inline-block dark:text-gray-300 dark:hover:text-white">
                                Propiedades
                            </Link>
                            <Link href="/arrendadores" className="block lg:inline-block dark:text-gray-300 dark:hover:text-white">
                                Arrendadores
                            </Link>
                            {isLoggedIn ? (
                                <DropdownUser />
                            ) : (
                                <div className="hidden md:flex items-center space-x-2">
                                    <Button as={NLink} href="/registrar" color="primary" variant="bordered" className="font-normal">
                                        Registrar
                                    </Button>
                                    <Button as={NLink} href="/login" color="primary" variant="solid" className="font-normal">
                                        Iniciar sesión
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Edit before... */}
                    {
                        isOpen && (
                            <div className="md:hidden">
                                <ul>
                                    <li className="block mt-2 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-700">
                                        <Link href="/" className="block lg:inline-block dark:text-gray-300 dark:hover:text-white">
                                            Inicio
                                        </Link>
                                    </li>
                                    <li className="block mt-2 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-700">
                                        <Link href="/propiedades" className="block lg:inline-block dark:text-gray-300 dark:hover:text-white">
                                            Propiedades
                                        </Link>
                                    </li>
                                    <li className="block mt-2 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-700">
                                        <Link href="/arrendadores" className="block lg:inline-block dark:text-gray-300 dark:hover:text-white">
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