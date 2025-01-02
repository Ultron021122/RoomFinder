import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation'
import { useSession } from "next-auth/react";
import { Button, Link as LinkUI } from "@nextui-org/react";
import DropdownUser from "./dropdown";
import { GraduationCapIcon } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useTheme } from "next-themes";

function Navbar({
    isOpen,
    toggle,
}: {
    isOpen: boolean,
    toggle: () => void;
}) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme()

    const handleThemeChange = (value: string) => {
        setTheme(value); // Cambiar al tema seleccionado
    };

    return (
        <>
            <nav className="w-screen max-w-screen-2xl bg-white border-b border-white dark:bg-gray-900 dark:border-gray-800 md:dark:border-gray-900 absolute top-0 z-50">
                <div className="max-w-screen-2xl p-4 sm:py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center justify-center h-auto">
                            {/* <GraduationCapIcon size={32} className="mr-2 text-neutral-900 dark:text-white" />
                            <h1 className="dark:text-gray-100 dark:hover:text-white text-2xl font-semibold">
                                RoomFinder
                            </h1> */}
                            <Image
                                src="/utils/5.png" // Imagen para modo claro
                                alt="RoomFinder"
                                width={162}
                                height={32}
                                priority
                                className="dark:hidden" // Ocultar en modo oscuro
                            />
                            <Image
                                src="/utils/logo-dark.png" // Imagen para modo oscuro
                                alt="RoomFinder"
                                width={162}
                                height={32}
                                priority
                                className="hidden dark:block" // Ocultar en modo claro
                            />
                        </Link>
                        <div className="md:hidden flex gap-3">
                            {session ? (
                                <DropdownUser />
                            ) : (
                                <Button as={LinkUI} href="/users/login" size="sm" color="primary" variant="solid" className="font-normal">
                                    Iniciar sesión
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
                        {
                            pathname != '/properties/map' && (
                                <div className="hidden md:flex items-center space-x-6 text-sm">
                                    <Link href="/" className={`block lg:inline-block dark:hover:text-white ${pathname === '/' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                        Inicio
                                    </Link>
                                    <Link href="/properties/map" className={`block lg:inline-block dark:hover:text-white ${pathname === '/properties/map' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                        Mapa de propiedades
                                    </Link>
                                    <Link href="/arrendadores" className={`block lg:inline-block dark:hover:text-white ${pathname === '/arrendadores' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                        Arrendadores
                                    </Link>
                                    <ModeToggle />
                                </div>
                            )
                        }
                        <div className="hidden md:flex items-center space-x-6 text-sm">
                            {session ? (
                                <DropdownUser />
                            ) : (
                                <div className="hidden md:flex items-center space-x-2">
                                    <Button as={LinkUI} href="/users/signup" size='sm' color="primary" variant="bordered" className="font-normal">
                                        Registrar
                                    </Button>
                                    <Button as={LinkUI} href="/users/login" size='sm' color="primary" variant="solid" className="font-normal">
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
                                    <li className={`block mt-2 py-2 pl-3 pr-4 text-gray-900 rounded dark:hover:bg-gray-800 ${pathname === '/properties/map' ? 'dark:bg-gray-800' : ''}`}>
                                        <Link href="/properties/map" className={`block lg:inline-block dark:hover:text-white ${pathname === '/properties/map' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                            Mapa de propiedades
                                        </Link>
                                    </li>
                                    <li className={`block mt-2 py-2 pl-3 pr-4 text-gray-900 rounded dark:hover:bg-gray-800 ${pathname === '/arrendadores' ? 'dark:bg-gray-800' : ''}`}>
                                        <Link href="/arrendadores" className={`block lg:inline-block dark:hover:text-white ${pathname === '/arrendadores' ? 'text-blue-500 dark:text-blue-500' : 'text-neutral-950 dark:text-gray-300'}`}>
                                            Arrendadores
                                        </Link>
                                    </li>
                                    {/* Falta por terminar */}
                                    <li className="block mt-2 py-2 text-gray-900 dark:text-gray-100 rounded dark:hover:bg-gray-800">
                                        <Select onValueChange={handleThemeChange} value={theme}>
                                            <SelectTrigger className="hover:border-gray-200 shadow-none dark:hover:border-gray-800">
                                                <SelectValue placeholder="Theme" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-blue-400">
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                            </SelectContent>
                                        </Select>
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