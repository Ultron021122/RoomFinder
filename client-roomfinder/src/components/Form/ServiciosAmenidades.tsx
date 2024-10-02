'use client';

import Image from "next/image";
import { useFormulario } from "./FormularioContext";
import clsx from 'clsx';

export const ImageElementStyles = {
    width: 40,
    height: 40,
    style: "flex gap-2 border border-gray-500 p-4 rounded-lg w-[250px] justify-center items-center hover:border-black hover:cursor-pointer"
}

const ServiciosData = [
    { icon: '/icon/cleaning.png', content: 'Limpieza' },
    { icon: '/icon/gas.png', content: 'Gas' },
    { icon: '/icon/power.png', content: 'Luz' },
    { icon: '/icon/television.png', content: 'TV cable' },
    { icon: '/icon/water-tap.png', content: 'Agua' },
    { icon: '/icon/wifi.png', content: 'Wifi' },
    { icon: '/icon/boiler.png', content: 'Boiler' }
];

const AmenidadesData = [
    { icon: '/icon/washing-machine.png', content: 'Lavadora' },
    { icon: '/icon/parking.png', content: 'Estacionamiento' },
    { icon: '/icon/kitchen.png', content: 'Cocina' },
    { icon: '/icon/fridge.png', content: 'Refrigerador' },
    { icon: '/icon/chair.png', content: 'Comedor' },
    { icon: '/icon/fence.png', content: 'Patio' },
    { icon: '/icon/sofa.png', content: 'Sala de estar' },
    { icon: '/icon/area-lavado.png', content: 'Área de lavado' },
    { icon: '/icon/ac.png', content: 'Aire acondicionado' }
]

export default function ServiciosAmenidades() {
    const { inmueble, setInmueble } = useFormulario();

    const handleServicio = (servicio: string) => {
        const serviciosActuales = inmueble.servicios;
        let nuevosServicios: string[] = [];

        if (serviciosActuales.includes(servicio)) {
            nuevosServicios = serviciosActuales.filter((s) => {
                return s !== servicio;
            })
        } else {
            nuevosServicios = [...serviciosActuales, servicio];
        }

        setInmueble({ servicios: nuevosServicios })
    }

    const handleAmenidad = (amenidad: string) => {

        const amenidadesAct = inmueble.amenidades;
        let nuevasAmenidades: string[] = []

        if (amenidadesAct.includes(amenidad)) {
            nuevasAmenidades = amenidadesAct.filter(a => {
                return a !== amenidad;
            });
        } else {
            nuevasAmenidades = [...amenidadesAct, amenidad];
        }

        setInmueble({ amenidades: nuevasAmenidades })
    }

    return (
        <div className="h-full">
            <h2 className="font-semibold text-center text-base sm:text-xl md:text-2xl mb-8 text-neutral-900 dark:text-gray-100">
                Servicios y amenidades
            </h2>
            <div>
                <p className="text-base mb-8 text-neutral-800 dark:text-gray-300">Selecciona los servicios que incluye el inmueble</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-2">
                    {
                        ServiciosData.map((data, index) =>
                            <div
                                key={index}
                                onClick={() => handleServicio(data.content)}
                                className={`rounded-md text-center text-xs md:text-sm px-5 py-3 flex flex-col items-center ${inmueble.servicios.includes(data.content) ? 'bg-blue-500 text-white' : 'text-neutral-900 bg-gray-200 dark:text-gray-200 dark:bg-gray-600'}`}
                            >
                                <Image
                                    src={data.icon}
                                    width={40}
                                    height={40}
                                    alt={`Icono de ${data.content}`}
                                    className={`filter dark:invert ${inmueble.servicios.includes(data.content) ? 'invert' : ''}`}
                                />
                                {data.content}
                            </div>
                        )
                    }
                </div>
            </div>
            <div>
                <p className="text-base my-8 text-neutral-800 dark:text-gray-300">
                    Selecciona las amenidades que tiene el inmueble
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-2">
                    {
                        AmenidadesData.map((data, index) =>
                            <div
                                key={index}
                                onClick={() => handleAmenidad(data.content)}
                                className={`rounded-md text-xs text-center md:text-sm px-5 py-3 flex flex-col items-center ${inmueble.amenidades.includes(data.content) ? 'bg-blue-500 text-white' : 'text-neutral-900 bg-gray-200 dark:text-gray-200 dark:bg-gray-600'}`}
                            >
                                <Image
                                    src={data.icon}
                                    width={40}
                                    height={40}
                                    alt={`Icono de ${data.content}`}
                                    className={`filter dark:invert ${inmueble.amenidades.includes(data.content) ? 'invert' : ''}`}
                                />
                                {data.content}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}