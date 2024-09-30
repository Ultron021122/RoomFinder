'use client';

import { useFormulario } from "./FormularioContext";
import dynamic from "next/dynamic";

export function getInput(tipoInput: string): string {
    console.log('tipoInput', tipoInput);
    const inputs: Record<string, string> = {
        'numExt': 'numExt',
        'numInt': 'numInt',
        'Costo': 'costo'
    };
    return inputs[tipoInput];
}

const DynamicMap = dynamic(() => import("@/components/Form/Map"),
    {
        ssr: false,
        loading: () => <p>Loading...</p>,
    });

export default function ConfirmarUbicacion() {
    const { inmueble, setInmueble } = useFormulario();
    let {
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

    // fijar los datos directamente en el contexto
    function handleInput(name: string, value: number | string) {
        const prop = getInput(name);
        console.log(prop, value, name);

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
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="pais"
                        id="pais"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={pais}
                    />
                    <label
                        htmlFor="pais"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        País
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="direccion"
                        id="direccion"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={direccion}
                    />
                    <label
                        htmlFor="direccion"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Dirección
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="estado"
                        id="estado"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={estado}
                    />
                    <label
                        htmlFor="estado"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Estado
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="number"
                        name="codigoPostal"
                        id="codigoPostal"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={codigoPostal}
                    />
                    <label
                        htmlFor="codigoPostal"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Código Postal
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="ciudad"
                        id="ciudad"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                        disabled={true}
                        value={ciudad_municipio}
                    />
                    <label
                        htmlFor="ciudad"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Ciudad / municipio
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="numExt"
                        id="numExt"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                        value={numExt}
                        onChange={(e) => handleInput('numExt', e.target.value)}
                    />
                    <label
                        htmlFor="numExt"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Número exterior (obligatorio)
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="numInt"
                        id="numInt"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                        value={numInt}
                        onChange={(e) => handleInput('numInt', e.target.value)}
                    />
                    <label
                        htmlFor="numInt"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Número interior (opcional)
                    </label>
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
            />
        </div>
    );
}