'use client';

import Mapa from "./Mapa";

export default function Ubicacion() {
    return(
        <div className="pb-8">
            <h2 className="text-center font-semibold text-3xl mb-10">Selecciona la ubicación del inmueble</h2>
            <p className="text-xl mb-8 text-center">Es necesario que indiques donde se ubica el inmueble para que los alumnos conozcan su ubicación</p>
            <Mapa/>
        </div>
    );
}