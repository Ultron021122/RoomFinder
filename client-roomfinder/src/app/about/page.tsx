import styles from './About.module.css';
import { Metadata } from 'next';
import Image from "next/image"

export const metadata: Metadata = {
    title: 'Arrendadores',
};

export default function AboutPage() {
    return (
        <div className="relative min-h-screen flex flex-col md:flex-row">
            {/* Imagen de fondo para dispositivos móviles */}
            <div className="absolute inset-0 md:hidden">
                <Image
                    src="/imagen-sobre-nosotros.jpg"
                    alt="Fondo Sobre Nosotros"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            {/* Imagen para pantallas medianas y grandes */}
            <div className="hidden md:block md:w-1/2 relative">
                <Image
                    src="/imagen-sobre-nosotros.jpg"
                    alt="Imagen Sobre Nosotros"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
            </div>

            {/* Contenido de texto */}
            <div className="md:w-1/2 p-8 flex items-center justify-center relative z-10">
                <div className="max-w-lg">
                    <h1 className="text-4xl font-bold mb-6 text-white md:text-gray-800">Sobre Nosotros</h1>
                    <p className="text-lg mb-4 text-white md:text-gray-600">
                        Somos una empresa dedicada a la innovación y excelencia en nuestro campo. Con años de experiencia, nos
                        enorgullece ofrecer soluciones de alta calidad a nuestros clientes.
                    </p>
                    <p className="text-lg text-white md:text-gray-600">
                        Nuestro equipo está compuesto por profesionales apasionados que se esfuerzan por superar las expectativas en
                        cada proyecto. Creemos en el poder de la colaboración y la creatividad para enfrentar los desafíos del
                        mañana.
                    </p>
                </div>
            </div>
        </div>
    );
}

