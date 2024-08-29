'use client';
import Layout from "@/components/layout";
import Footer from '@/components/Footer';
import { images, propertiesHome } from "@/utils/constants";
import MasonryImageList from "@/components/Imagelist";
import { CardOwner } from "./Card";
import Banner from "./Banner";
import FrontPage from "./FrontPage";

export default function Inicio() {
    return (
        <Layout key={1}>
            <div className='h-[100vh] w-full'>
                <FrontPage />
                {/*
                <div className='h-[calc(100vh)] max-w-screen-2xl mx-auto bg-cover bg-no-repeat bg-center bg-black bg-opacity-30 dark:bg-opacity-45 bg-blend-darken flex justify-center items-center p-5 flex-col' style={{ backgroundImage: `url(${images[0].url})` }}>
                    <h2 className="text-white text-4xl sm:text-6xl font-bold">
                        Roomfinder
                    </h2>
                    <p className="text-gray-300">Encuentra tu espacio ideal con Roomfinder.</p>
                </div>*/}
                <section className="container mx-auto my-10 p-2 sm:p-0">
                    <div className="mb-5">
                        <div className="text-center mb-20">
                            <h3 className="dark:text-gray-100 text-3xl md:text-4xl xl:text-5xl tracking-tight font-bold leading-none mt-10">
                                Propiedades destacadas
                            </h3>
                            <p className="mt-2 mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                                Algunas de las propiedades más destacadas de Roomfinder.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {
                                propertiesHome.map((property, index) => (
                                    <CardOwner key={index} id={property.id} title={property.title} description={property.description} image={property.imageUrl} />
                                ))
                            }
                        </div>
                    </div>
                    <Banner />
                    {/* <div className="bg-white text-blue-500">
                        <Image src="/logo1.svg" alt="Propiedades destacadas" className="h-10" />
                    </div> */}
                    <h3 className="dark:text-gray-100 text-3xl md:text-4xl xl:text-5xl tracking-tight font-bold leading-none  mt-10 mb-5">
                        Galeria de Imagenes
                    </h3>
                    <MasonryImageList />
                </section>
                <Footer />
            </div >
        </Layout >
    );
};
