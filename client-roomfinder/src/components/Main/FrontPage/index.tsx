import { images } from '@/utils/constants';
import { ArrowRight, Video } from 'lucide-react';
import Link from 'next/link';

export default function FrontPage() {
    return (
        <>
            <section className="max-w-screen-2xl mx-auto flex flex-col justify-center items-center min-h-[100vh] bg-cover bg-no-repeat bg-center bg-black bg-opacity-45 bg-blend-darken" style={{ backgroundImage: `url(${images[0].url})` }} >
                <div className="px-4 mx-auto max-w-screen-xl text-center lg:px-12">
                    <a href="#" className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm rounded-full bg-gray-800 text-white hover:bg-gray-700" role="alert">
                        <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">Nuevo</span> <span className="text-sm font-medium">¡Nuevas habitaciones disponibles! Descúbrelo</span>
                        <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    </a>
                    <h1 className="mb-4 text-3xl font-extrabold tracking-tight leading-none md:text-4xl lg:text-5xl text-white">Encuentra tu habitación ideal</h1>
                    <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-300">
                        RoomFinder está aquí para ayudarte a encontrar la habitación perfecta cerca de tu universidad. Explora nuestras opciones y haz tu elección hoy mismo.
                    </p>
                    <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <Link href="/" className="inline-flex justify-center items-center py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-800">
                            Ver más
                            <ArrowRight size={20} className="ml-2 -mr-1" />
                        </Link>
                        <Link href="/video" className="inline-flex justify-center items-center py-3 px-5 text-sm font-medium text-center rounded-lg border focus:ring-4 text-white border-gray-500 hover:bg-gray-500 focus:ring-gray-800 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                            <Video size={20} className="mr-2 -ml-1" />
                            Ver video
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}