import Galeria from '@/components/carrousel';
import styles from './About.module.css';
import { Metadata } from 'next';
import Image from 'next/image';
import { AboutUs } from '@/utils/constants';

export const metadata: Metadata = {
    title: 'Sobre Nosotros',
};

export default function AboutPage() {
    const listaImagenes = AboutUs.map((imagen, index) =>
        <div key={index} className="relative min-w-full h-full">
            <Image
                width={1500}
                height={100}
                src={imagen.url}
                alt={`Imagen de inmueble ${imagen.photoid}`}
                className="absolute inset-0 object-cover w-full h-full"
            />
        </div>
    );

    return (
        <section className="min-h-screen bg-white dark:bg-gray-950">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center h-screen">
                {/* Galería de imágenes */}
                <div className="hidden md:block relative">
                    <Galeria imagenes={listaImagenes} />
                </div>
                {/* Contenido de texto */}
                <div className="flex items-center justify-center p-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-6 text-neutral-950 dark:text-white">Sobre Nosotros</h1>
                        <p className="text-lg mb-4 text-neutral-800 dark:text-gray-400">
                            Somos una empresa dedicada a la innovación y excelencia en nuestro campo. Con años de experiencia, nos enorgullece ofrecer soluciones de alta calidad a nuestros clientes.
                        </p>
                        <p className="text-lg text-neutral-800 dark:text-gray-400">
                            Nuestro equipo está compuesto por profesionales apasionados que se esfuerzan por superar las expectativas en cada proyecto. Creemos en el poder de la colaboración y la creatividad para enfrentar los desafíos del mañana.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}