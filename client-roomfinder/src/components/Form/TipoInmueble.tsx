'use client';

import { useFormulario } from "./FormularioContext";
import { Card, CardFooter} from "@nextui-org/react";
import Image from "next/image";

const tiposInmueble = [
    { id: 1, content: 'Casa', img: '/utils/tipoPropiedad.jpg' },
    { id: 2, content: 'Habitación', img: '/utils/tipoPropiedad2.jpg' },
    { id: 3, content: 'Departamento', img: '/utils/tipoPropiedad3.jpg' }
]

export default function TipoInmueble() {
    const { inmueble, setInmueble, reiniciarValores } = useFormulario();

    const handleSelect = (tipo: number) => {

        if (inmueble.tipoInmueble) {
            reiniciarValores();
        }

        setInmueble({ tipoInmueble: tipo });
    }

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
                {
                    tiposInmueble.map((data, index) =>
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
                    )
                }
            </div>
        </div>
    );
}