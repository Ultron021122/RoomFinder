'use client';

import Image from "next/image";
import { ServicesAmenities, useFormulario } from "./FormularioContext";
import clsx from 'clsx';

export const ImageElementStyles = {
    width: 40,
    height: 40,
    style: "flex gap-2 border border-gray-500 p-4 rounded-lg w-[250px] justify-center items-center hover:border-black hover:cursor-pointer"
}

const ServiciosData = [
    { id: 1, icon: '/icon/cleaning.png', content: 'Limpieza', variable: 'bnCleaningIncluded' },
    { id: 2, icon: '/icon/gas.png', content: 'Gas', variable: "bnGasIncluded" },
    { id: 3, icon: '/icon/power.png', content: 'Luz', variable: "bnElectricityIncluded" },
    { id: 4, icon: '/icon/television.png', content: 'TV cable', variable: "bnCableTVIncluded" },
    { id: 5, icon: '/icon/water-tap.png', content: 'Agua', variable: "bnWaterIncluded" },
    { id: 6, icon: '/icon/wifi.png', content: 'Wifi', variable: "bnInternetIncluded" },
    { id: 7, icon: '/icon/boiler.png', content: 'Boiler', variable: "bnHeatingIncluded" }
];

const AmenidadesData = [
    { id: 8, icon: '/icon/washing-machine.png', content: 'Lavadora', variable: "bnWashingMachineIncluded" },
    { id: 9, icon: '/icon/parking.png', content: 'Estacionamiento', variable: "bnParkingIncluded" },
    { id: 10, icon: '/icon/kitchen.png', content: 'Cocina', variable: "bnKitchen" },
    { id: 11, icon: '/icon/fridge.png', content: 'Refrigerador', variable: "bnCoolerIncluded" },
    { id: 12, icon: '/icon/chair.png', content: 'Comedor', variable: "bnDiningRoom" },
    { id: 13, icon: '/icon/fence.png', content: 'Patio', variable: "bnGardenIncluded" },
    { id: 14, icon: '/icon/sofa.png', content: 'Sala de estar', variable: "bnLivingRoom" },
    { id: 15, icon: '/icon/area-lavado.png', content: 'Área de lavado', variable: "bnWashingArea" },
    { id: 16, icon: '/icon/ac.png', content: 'Aire acondicionado', variable: "bnAirConditioningIncluded" }
];

export default function ServiciosAmenidades() {
    const { inmueble, setInmueble } = useFormulario();

    const handleServicio = (variable: keyof ServicesAmenities) => {
        // Actualizamos los servicios con el cambio
        const nuevosServicios = { ...inmueble.servicios };
        nuevosServicios[variable] = !nuevosServicios[variable]; // Cambia el valor de true a false y viceversa
        setInmueble({ servicios: nuevosServicios });
    };

    const handleAmenidad = (variable: keyof ServicesAmenities) => {
        // Actualizamos las amenidades con el cambio
        const nuevasAmenidades = { ...inmueble.servicios }; // Usamos `inmueble.servicios` porque `amenidades` ya es un objeto
        nuevasAmenidades[variable] = !nuevasAmenidades[variable];
        setInmueble({ servicios: nuevasAmenidades }); // Se actualiza el estado con la nueva configuración
    };

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
                                onClick={() => handleServicio(data.variable as keyof ServicesAmenities)} // Aseguramos que el tipo sea keyof ServicesAmenities
                                className={`rounded-md text-center text-xs md:text-sm px-5 py-3 flex flex-col items-center ${inmueble.servicios[data.variable as keyof ServicesAmenities] ? 'bg-blue-500 text-white' : 'text-neutral-900 bg-gray-200 dark:text-gray-200 dark:bg-gray-600'}`}
                            >
                                <Image
                                    src={data.icon}
                                    width={35}
                                    height={35}
                                    alt={`Icono de ${data.content}`}
                                    className={`filter dark:invert ${inmueble.servicios[data.variable as keyof ServicesAmenities] ? 'invert' : ''}`}
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
                                onClick={() => handleAmenidad(data.variable as keyof ServicesAmenities)} // Aseguramos que el tipo sea keyof ServicesAmenities
                                className={`rounded-md text-xs text-center md:text-sm px-5 py-3 flex flex-col items-center ${inmueble.servicios[data.variable as keyof ServicesAmenities] ? 'bg-blue-500 text-white' : 'text-neutral-900 bg-gray-200 dark:text-gray-200 dark:bg-gray-600'}`}
                            >
                                <Image
                                    src={data.icon}
                                    width={40}
                                    height={40}
                                    alt={`Icono de ${data.content}`}
                                    className={`filter dark:invert ${inmueble.servicios[data.variable as keyof ServicesAmenities] ? 'invert' : ''}`}
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
