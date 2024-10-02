'use client';

import { useFormulario } from "./FormularioContext";
import { Building, DoorClosed, Home } from "lucide-react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";


const tiposInmueble = [
    { icon: <Home size={24} />, content: 'Casa', img: '/utils/tipoPropiedad.jpg' },
    { icon: <DoorClosed size={24} />, content: 'Habitación', img: '/utils/tipoPropiedad2.jpg' },
    { icon: <Building size={24} />, content: 'Departamento', img: '/utils/tipoPropiedad3.jpg' }
]

export default function TipoInmueble() {
    const { inmueble, setInmueble, reiniciarValores } = useFormulario();

    const handleSelect = (tipo: string) => {

        if (inmueble.tipoInmueble.trim() !== '') {
            reiniciarValores();
        }

        setInmueble({ tipoInmueble: tipo });
    }

    return (
        <div className="h-full">
            <h2 className="font-semibold text-base sm:text-xl md:text-2xl mb-10 text-neutral-900 dark:text-gray-100">
                Seleccione el tipo de inmueble a publicar
            </h2>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {
                    tiposInmueble.map((data, index) =>
                        <div
                            key={index}
                            onClick={() => handleSelect(data.content)}
                        >
                            <Card
                                isFooterBlurred
                                radius="lg"
                                className="border-none bg-gray-800"
                            >
                                <div className="h-52">
                                    <Image
                                        alt={`Icono de ${data.content}`}
                                        height={800}
                                        src={data.img}
                                        width={800}
                                        className='object-cover w-full h-full'
                                    />
                                </div>
                                <CardFooter
                                    className={`justify-center bg-black/20 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 ${inmueble.tipoInmueble === data.content ? 'bg-[#007aff]' : ''}`}
                                >
                                    <p className={`text-center text-sm ${inmueble.tipoInmueble === data.content ? 'text-white' : 'text-white/80'}`}>
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