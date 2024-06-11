'use client';
import Layout from "@/components/layout";
import Footer from '@/components/Footer';
import { images, propertiesHome } from "@/utils/constants";
import MasonryImageList from "@/components/Imagelist";
import { Image } from "@nextui-org/react";
import { CardOwner } from "./Card";

export default function Inicio() {
    return (
        <Layout key={1}>
            <div className='h-[calc(100vh-73px)] w-full'>
                <div className='h-[calc(100vh-73px)] max-w-screen-2xl mx-auto bg-cover bg-no-repeat bg-center bg-black bg-opacity-30 dark:bg-opacity-45 bg-blend-darken flex justify-center items-center p-5 flex-col' style={{ backgroundImage: `url(${images[0].url})` }}>
                    <h2 className="text-white text-4xl sm:text-6xl font-bold">
                        Roomfinder
                    </h2>
                    <p className="text-gray-300">Encuentra tu espacio ideal con Roomfinder.</p>
                </div>
                <section className="container mx-auto my-10 p-2 sm:p-0">
                    <div className="mb-5">
                        <h3 className="dark:text-gray-300 text-xl sm:text-3xl text-center font-semibold mb-10">
                            Propiedades destacadas
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {
                                propertiesHome.map((property, index) => (
                                    <CardOwner key={index} id={property.id} title={property.title} description={property.description} image={property.imageUrl} />
                                ))
                            }
                        </div>

                    </div>
                    {/* <div className="bg-white text-blue-500">
                        <Image src="/logo1.svg" alt="Propiedades destacadas" className="h-10" />
                    </div> */}
                    <h3 className="dark:text-gray-300 text-xl sm:text-3xl font-semibold mt-10 mb-5">
                        Galeria de Imagenes
                    </h3>
                    <MasonryImageList />
                </section>
                <Footer />
            </div >
        </Layout >
    );
};
