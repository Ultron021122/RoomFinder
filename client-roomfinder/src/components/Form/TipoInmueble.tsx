'use client';

import { useFormulario } from "./FormularioContext";
import { Card, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import { LandPlot, Ruler } from 'lucide-react'; // Importar el icono

const tiposInmueble = [
    { id: 1, content: 'Casa', img: '/utils/tipoPropiedad.jpg' },
    { id: 2, content: 'Habitación', img: '/utils/tipoPropiedad2.jpg' },
    { id: 3, content: 'Departamento', img: '/utils/tipoPropiedad3.jpg' }
];

export default function TipoInmueble() {
    const { inmueble, setInmueble, reiniciarValores } = useFormulario();

    const handleSelect = (tipo: number) => {
        if (inmueble.tipoInmueble) {
            reiniciarValores();
        }
        setInmueble({ tipoInmueble: tipo });
    };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     // Permitir que el valor sea vacío o un número positivo
    //     const decarea = value ? parseFloat(value) : 0;

    //     setInmueble({
    //         additionalFeatures: {
    //             ...inmueble.additionalFeatures,
    //             decarea: decarea,
    //         }
    //     });
    // };

    return (
        <div className="h-full">
            <div className='mb-12 text-center'>
                <h2 className="font-semibold text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                    Tipo de inmueble
                </h2>
                <p className="text-sm mb-8 text-neutral-800 dark:text-gray-400">
                    Selecciona el tipo de inmueble que deseas publicar
                </p>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {tiposInmueble.map((data, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelect(data.id)}
                    >
                        <Card
                            isFooterBlurred
                            radius="lg"
                            className="border-none bg-gray-800"
                        >
                            <div className="relative h-52 overflow-hidden">
                                <Image
                                    src={data.img}
                                    alt={`Icono de ${data.content}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className='object-cover w-full h-full'
                                />
                            </div>
                            <CardFooter
                                className={`justify-center bg-black/20 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 ${inmueble.tipoInmueble === data.id ? 'bg-[#007aff]' : ''}`}
                            >
                                <p className={`text-center text-sm ${inmueble.tipoInmueble === data.id ? 'text-white' : 'text-white/80'}`}>
                                    {data.content}
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                ))}
            </div>
            {/* Area cuadrada */}
            {/* <p className="text-xs my-5 text-neutral-800 dark:text-gray-400">
                Ingresa el área en metros cuadrados
            </p> */}
            {/* <LandPlot className="flex flex-col text-gray-500 dark:text-gray-400 mr-2" /> Añadir icono */}
            {/* <div className="relative col-span-1 md:col-span-2 z-0 w-full md:w-1/3 mb-5 group flex items-center">
                <input
                    type="number"
                    name="decarea"
                    id="decarea"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    step="any" // Permitir decimales
                    min="0"   // Solo permitir números positivos
                    value={inmueble.additionalFeatures.decarea || ''}  // Mostrar vacío si el área no está definida
                    onChange={handleChange}
                />
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">m²</span>
                <label
                    htmlFor="decarea"F
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Área
                </label>
            </div> */}
        </div>
    );
}