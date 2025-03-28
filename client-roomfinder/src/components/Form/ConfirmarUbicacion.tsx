'use client';

import { useEffect, useRef } from "react";
import { Spinner } from "@nextui-org/react";
import { useFormulario } from "./FormularioContext";
import dynamic from "next/dynamic";
import { findClosestCoordinate } from "@/utils/functions";
import { universities } from "@/utils/constants";

export function getInput(tipoInput: string): string {
    const inputs: Record<string, string> = {
        'numExt': 'numExt',
        'numInt': 'numInt',
        'precio': 'precio'
    };
    return inputs[tipoInput];
}

const DynamicMap = dynamic(() => import("@/components/Form/Map"), {
    ssr: false,
    loading: () => <Spinner />,
});

export default function ConfirmarUbicacion() {
    const { inmueble, setInmueble } = useFormulario();
    const {
        pais,
        direccion,
        estado,
        codigoPostal,
        ciudad_municipio,
        numExt,
        numInt,
        latitud,
        longitud
    } = inmueble.ubicacion;

    const previousClosestRef = useRef<{ name: string, fldistanceuniversity: number } | null>(null);

    useEffect(() => {
        const closest = findClosestCoordinate({ lat: latitud, lng: longitud }, universities);
        if (closest && (
            !previousClosestRef.current ||
            closest.name !== previousClosestRef.current.name ||
            closest.fldistanceuniversity !== previousClosestRef.current.fldistanceuniversity
        )) {
            setInmueble({
                additionalFeatures: {
                    ...inmueble.additionalFeatures,
                    fldistanceuniversity: closest.fldistanceuniversity || 0,
                    vchuniversity: closest.name || ''
                }
            });
            previousClosestRef.current = closest;
            console.log('La coordenada más cercana es:', closest);
        }
    }, [latitud, longitud, setInmueble, inmueble.additionalFeatures]);

    // fijar los datos directamente en el contexto
    function handleInput(name: string, value: number | string) {
        const prop = getInput(name);

        setInmueble({
            ubicacion: {
                ...inmueble.ubicacion,
                [prop]: value
            }
        });
    }

    return (
        <div>
            <div className='mb-12 text-center'>
                <h2 className="font-semibold text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                    Confirmar la ubicación del inmueble
                </h2>
                <p className="text-sm mb-8 text-neutral-800 dark:text-gray-400">
                    Por favor, verifica que los datos de la ubicación del inmueble sean correctos
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto px-8 py-4">
                {/* Campos de la ubicación */}
                {/* Dirección */}
                <div>
                    <label
                        htmlFor="direccion"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Dirección de la propiedad
                    </label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={direccion}
                    />
                </div>
                {/* Pais */}
                <div>
                    <label
                        htmlFor="pais"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        País
                    </label>
                    <input
                        type="text"
                        id="pais"
                        name="pais"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={pais}
                    />
                </div>
                {/* Estado */}
                <div>
                    <label
                        htmlFor="estado"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Estado
                    </label>
                    <input
                        type="text"
                        id="estado"
                        name="estado"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={estado}
                    />
                </div>
                {/* Ciudad / Municipio */}
                <div>
                    <label
                        htmlFor="ciudad"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Ciudad / Municipio
                    </label>
                    <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={ciudad_municipio}
                    />
                </div>
                {/* Código Postal */}
                <div>
                    <label
                        htmlFor="codigoPostal"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Codigo Postal
                    </label>
                    <input
                        type="text"
                        id="codigoPostal"
                        name="codigoPostal"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={codigoPostal}
                    />
                </div>
                {/* Número exterior y interior */}
                <div className="grid gap-2 grid-cols-1 md:grid-cols-2 w-full">
                    {/* Número exterior */}
                    <div className="mb-5">
                        <label
                            htmlFor="numExt"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Número exterior
                        </label>
                        <input
                            type="text"
                            id="numExt"
                            name="numExt"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder=""
                            autoComplete="off"
                            value={numExt}
                            onChange={(e) => handleInput('numExt', e.target.value)}
                        />
                    </div>
                    {/* Número interior */}
                    <div className="mb-5">
                        <label
                            htmlFor="numInt"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Número interior
                        </label>
                        <input
                            type="text"
                            id="numInt"
                            name="numInt"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder=""
                            autoComplete="off"
                            value={numInt}
                            onChange={(e) => handleInput('numInt', e.target.value)}
                        />
                    </div>
                </div>
                <input
                    type="hidden"
                    name="latitud"
                    id="latitud"
                    value={latitud}
                />
                <input
                    type="hidden"
                    name="longitud"
                    id="longitud"
                    value={longitud}
                />
            </div>

            <DynamicMap
                position={[latitud, longitud]}
                zoom={16}
                style="rounded-sm shadow-lg h-96 w-96 w-full mx-auto"
            />
        </div>
    );
}