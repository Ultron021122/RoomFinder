import Image from "next/image";
import ImageElement from "@/components/GeneralComponents/ImageElement";
import { Globe, LayoutTemplate, Network, Settings, ShieldCheck, TrendingUp } from "lucide-react";

export default function Home() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto bg-zinc-200 dark:bg-gray-900">
            <div className="mx-auto">
                <header className="relative h-96 sm:h-72 bg-gray-500">
                    <Image
                        src={'/background/fondo-1.jpg'}
                        alt="RoomFinder background image"
                        layout='fill'
                        objectFit='cover'
                    />
                    <div className="flex flex-col justify-center items-center place-items-center absolute inset-0 bg-black bg-opacity-50">
                        <h1 className="font-semibold text-2xl md:text-5xl mb-4 text-white">¡Bienvenido a RoomFinder!</h1>
                        <p className="font-medium text-white text-base md:text-lg text-center p-2">
                            Estamos encantados de que te unas a nuestra comunidad.
                        </p>
                    </div>
                </header>

                <section className="my-5 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="">
                        <h3 className="text-xl mt-10 mb-5 sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                            ¿Qué es RoomFinder?
                        </h3>
                        <p className="text-neutral-800 text-sm sm:text-base dark:text-gray-200">
                            RoomFinder es una plataforma diseñada específicamente para conectar a arrendadores como tú con estudiantes universitarios que buscan un lugar seguro, cómodo y adecuado para vivir mientras continúan sus estudios.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div className="w-auto p-6 flex flex-col justify-center items-center gap-2">
                            <LayoutTemplate className="text-blue-700" size={72} />
                            <p className="text-center font-semibold text-gray-800 dark:text-gray-200">
                                Publicar y Gestionar tus inmuebles
                            </p>
                        </div>
                        <div className="w-auto p-6 flex flex-col justify-center items-center gap-2">
                            <Globe className="text-blue-700" size={72} />
                            <p className="text-center font-semibold text-gray-800 dark:text-gray-200">
                                Conectar con Inquilinos Potenciales
                            </p>
                        </div>
                        <div className="w-auto p-6 flex flex-col justify-center items-center gap-2">
                            <TrendingUp className="text-blue-700" size={72} />
                            <p className="text-center font-semibold text-gray-800 dark:text-gray-200">
                                Optimizar tus Rentas
                            </p>
                        </div>
                        <div className="w-auto p-6 flex flex-col justify-center items-center gap-2">
                            <ShieldCheck className="text-blue-700" size={72} />
                            <p className="text-center font-semibold text-gray-800 dark:text-gray-200">
                                Asegurar tus inmuebles
                            </p>
                        </div>
                    </div>
                </section>
                {/*
                    <section className="relative mt-12 h-72">
                        <Image
                            src={'/background/fondo-5.jpg'}
                            alt='RoomFinder background image'
                            layout='fill'
                            objectFit="cover"
                        />

                        <div className="flex justify-center items-center absolute inset-0 bg-black bg-opacity-50">
                            <h2 className="text-center text-3xl mb-6 text-white font-semibold">Nuestro propósito</h2>
                        </div>
                    </section>

                    <section className="my-12">
                        <div className="w-[95%] mx-auto grid grid-cols-2 gap-5">
                            <Image
                                src={'/background/fondo-4.jpg'}
                                alt='RoomFinder background image'
                                width={600}
                                height={450}
                                layout="responsive"
                            />
                            <p className="text-lg leading-9">
                                Nuestro objetivo es facilitar el proceso de renta para ambos lados: que los estudiantes encuentren el lugar ideal donde vivir mientras estudian, y que tú como arrendador puedas alquilar tus inmuebles de manera más rápida y efectiva. Creemos en crear una experiencia segura y conveniente, donde los estudiantes puedan concentrarse en sus estudios sabiendo que tienen un hogar adecuado, y tú puedas gestionar tus propiedades con tranquilidad.

                                ¡Gracias por confiar en nosotros! Estamos aquí para ayudarte a optimizar la ocupación de tus inmuebles y a establecer conexiones exitosas con la comunidad estudiantil.
                            </p>
                        </div>
                    </section>
                */}
            </div>
        </div>
    );
}