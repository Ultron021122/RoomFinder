import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-200 shadow dark:border-gray-900 dark:bg-gray-950 max-w-screen-2xl mx-auto">
            <div className="w-full mx-auto max-w-screen-2xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-neutral-950 sm:text-center dark:text-gray-300 dark:hover:text-white">
                    © {currentYear} <Link href="/" className="hover:underline">RoomFinder™</Link>. Todos Los Derechos Reservados.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
                    <li>
                        <Link href="/about" className="dark:hover:text-white me-4 md:me-6 text-neutral-950 dark:text-gray-300">
                            Sobre nosotros
                        </Link>
                    </li>
                    <li>
                        <Link href="/privacity" className="dark:hover:text-white me-4 md:me-6 text-neutral-950 dark:text-gray-300">
                            Politica de privacidad
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className="dark:hover:text-white me-4 md:me-6 text-neutral-950 dark:text-gray-300">
                            Contacto
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
}