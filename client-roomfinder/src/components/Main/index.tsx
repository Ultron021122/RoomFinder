'use client';
import Layout from "@/components/layout";
import Footer from '@/components/Footer';
import { images } from "@/utils/constants";
import MasonryImageList from "@/components/Imagelist";
import { Image } from "@nextui-org/react";

export default function Inicio() {
    return (
        <Layout key={1}>
            <div className='h-[calc(100vh-73px)] w-full'>
                <div className='h-[calc(100vh-73px)] max-w-screen-2xl mx-auto bg-cover bg-no-repeat bg-center bg-black bg-opacity-30 dark:bg-opacity-45 bg-blend-darken flex justify-end items-start p-5 flex-col' style={{ backgroundImage: `url(${images[0].url})` }}>
                    <h2 className="text-white text-4xl sm:text-6xl font-bold">
                        Roomfinder
                        {/* <span className="ml-2 text-gray-200 font-light">
                            Tu puerta a un hogar perfecto.
                        </span> */}
                    </h2>
                    <p className="text-gray-300">Encuentra tu espacio ideal con Roomfinder.</p>
                </div>
                <section className="container mx-auto my-10 p-2 sm:p-0">
                    <div className="mb-5">
                        <h3 className="dark:text-gray-300 text-2xl font-bold text-center mb-5">
                            Propiedades destacadas
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg">
                                <h4 className="dark:text-white text-lg font-semibold">Casa en la playa</h4>
                                <p className="dark:text-gray-300">Hermosa casa en la playa con vista al mar.</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg">
                                <h4 className="dark:text-white text-lg font-semibold">Casa en la montaña</h4>
                                <p className="dark:text-gray-300">Casa en la montaña con vista a la ciudad.</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg">
                                <h4 className="dark:text-white text-lg font-semibold">Casa en la ciudad</h4>
                                <p className="dark:text-gray-300">Casa en la ciudad con vista al parque.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white text-blue-500">
                        <Image src="/logo1.svg" alt="Propiedades destacadas" className="h-10" />
                    </div>
                    <MasonryImageList />
                </section>
                <Footer />
            </div >
        </Layout >
    );
};
