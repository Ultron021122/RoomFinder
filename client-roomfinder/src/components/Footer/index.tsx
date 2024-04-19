export default function Footer() {
    return (
        <footer className="bg-white mt-12 border-t border-gray-200 shadow dark:bg-gray-950 dark:border-gray-900">
            <div className="w-full mx-auto max-w-screen-2xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://roomfinder.site" className="hover:underline">RoomFinder™</a>. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">About</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline mr-2">Contact</a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};