'use client';

import { useFormulario } from "./FormularioContext";
import { useMemo } from "react";
import Image from 'next/image';
import { getInput } from "./ConfirmarUbicacion";
import Input from "../GeneralComponents/Input";

export default function CostoMes(){

    const {inmueble, setInmueble} = useFormulario();

    const imagenes = useMemo(() => {
        return inmueble.fotos.map((foto, index) => {
            const url = URL.createObjectURL(foto);

            /* posicionamiento de la imágen principal */
            let colSpan = index === 0 ? 'col-span-2' : null;
            let rowSpan = index === 0 ? 'row-span-2' : null;
            let height = index === 0 ? 'h-[100%]' : 'h-[180px]';

            return index < 5 &&(
                <div key={index} className={`relative w-[100%] ${height}  ${colSpan} ${rowSpan}`}>
                    <Image
                        src={url}
                        alt="Imagen del inmueble"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                </div>
            );
        });
    },[]);

    function handleInput(nombre: string, value : string | number){
        const prop = getInput(nombre);
        setInmueble({[prop] : value})
    }

    return(
        <div className="w-[95%] mx-auto">
            <h2 className="text-center font-semibold text-3xl mb-10">Para finalizar, establece el costo del inmueble por mes</h2>
            <h3 className="text-xl mb-4 font-semibold">Título: <span className="font-normal">{inmueble.titulo}</span> </h3>
            <p className="text-xl font-semibold">Fotografías del inmueble</p>
            <p className="text-gray-600 mb-4 text-lg">No todas las fotografías están incluidas en este apartado. Posteriormente se mostrarán todas.</p>
            <div className="grid grid-cols-4 grid-rows-2 gap-2"> {/* contenedor de imagenes */}
                {imagenes}
            </div>
            <p className="text-xl mt-4 font-semibold">Descripción: <span className="font-normal">{inmueble.descripcion}</span></p>
            <div className="w-[50%] mx-auto p-4">
                <Input
                    type="number"
                    nombre="Costo"
                    placeholder="Ingrese el costo por mes MXN"
                    disabled={false}
                    handleInput={handleInput}
                    value={inmueble.costo}
                />
            </div>
        </div>
    );
}