"use client";
import { Avatar } from "@nextui-org/react";
import { useState } from "react";

const Dropdown = ({
    id,
    name,
    last_name,
    email,
    logout,
}: {
    id: number,
    name: string,
    last_name: string,
    email: string,
    logout: () => void;
}): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button type="button" onClick={toggleDropdown} className="flex items-center text-sm dark:bg-gray-900 rounded-full md:me-0">
                    <span className="sr-only">Open user menu</span>
                    <Avatar src="/perfil.jpg" size="sm" className="mr-2" />
                    {/* <Image className="rounded-full mr-2" width="32" height="32" src='/perfil.jpg' alt="User photo" /> */}
                    <p className="dark:text-white">{name}</p>
                </button>
                {
                    isOpen && (
                        <>
                            <div className="absolute top-20 right-3 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-900 dark:text-white">{name + ' ' + last_name}</span>
                                    <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">{email}</span>
                                </div>
                                <ul className="py-2">
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={(event) => { logout(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    );
};

export default Dropdown;