'use client';

import Mapa from "./Mapa";

export default function Ubicacion() {
    return (
        <div className="pb-8">
            <div className='mb-12 text-center'>
                <h2 className="font-semibold text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                    Selecciona la ubicación del inmueble
                </h2>
                <p
                    className="text-sm mb-8 text-neutral-800 dark:text-gray-400"
                >
                    Es necesario que indiques donde se ubica el inmueble para que los alumnos conozcan su ubicación
                </p>
            </div>
            <Mapa />
        </div>
    );
}