import React from "react";
import Link from "next/link";
import Dropdown from "./Dropdown";
import { useSessionStore } from "../../sesiones/global";

const Navbar = ({
    isOpen,
    toggle,
}: {
    isOpen: boolean,
    toggle: () => void;
}): JSX.Element => {

    const { isLoggedIn, user, logout } = useSessionStore();
    return (
        <>
            <nav className="w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-800">
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
                                <Dropdown id={user ? user.id : 0} name={user ? user.name : ''} last_name={user ? user.last_name : ''} email={user ? user.email : ''} logout={logout} />
                            ) : (
                                <Link href="/sesion" className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
                                    Iniciar sesión
                                </Link>
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
                            <Link href="/" className="block lg:inline-block dark:text-gray-300 dark:hover:text-white">
                                Arrendadores
                            </Link>
                            {isLoggedIn ? (
                                <Dropdown id={user ? user.id : 0} name={user ? user.name : ''} last_name={user ? user.last_name : ''} email={user ? user.email : ''} logout={logout} />
                            ) : (
                                <Link href="/sesion" className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
                                    Iniciar sesión
                                </Link>
                                // <div className="space-x-2">
                                //     <Link href="/sesion" className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
                                //         Iniciar sesión
                                //     </Link>
                                //     <Link href="/registrar" className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
                                //         Registrar
                                //     </Link>
                                // </div>
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
                                        <Link href="/" className="block lg:inline-block dark:text-gray-300 dark:hover:text-white">
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