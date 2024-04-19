'use client';
import Layout from "@/components/layout";
import Footer from '@/components/Footer';

export default function Inicio() {
    return (
        <Layout key={1}>
            <div className='h-[calc(100vh-73px)] w-full'>
                <div className='h-[calc(100vh-73px)] max-w-screen-2xl mx-auto bg-cover bg-no-repeat bg-center bg-black bg-opacity-45 bg-blend-darken flex justify-end items-start p-5 flex-col' style={{ backgroundImage: `url(/images/home_1.jpg)` }}>
                    <h2 className="dark:text-white text-5xl font-bold">
                        RoomFinder.
                        <span className="ml-2 dark:text-gray-200 font-light">
                            Tu puerta a un hogar perfecto.
                        </span>
                    </h2>
                    <p className="dark:text-gray-300">Encuentra tu espacio ideal con Roomfinder.</p>
                </div>
                <main className="container mx-auto my-10">
                    <div className="mb-5">
                        <h1 className="dark:text-white text-2xl font-bold">Proyecto Modular</h1>
                        <p className="dark:text-white">
                            Este proyecto fue creado con el objetivo de mostrar la modularización de una aplicación
                        </p>
                    </div>
                </main>
                <Footer />
            </div >
        </Layout >
    );
};