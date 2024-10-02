'use client';

import { useFormulario } from "./FormularioContext";
import Image from 'next/image';
import Input from "../GeneralComponents/Input";
import { inputVacio } from "./Wizar";
import { Chip, Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { MapPin, Star } from "lucide-react";

const DynamicMap = dynamic(() => import("@/components/Form/Map"),
    {
        ssr: false,
        loading: () => <Spinner />,
    });

function getIcon(inmueble: string) {
    const iconos: Record<string, string> = {
        'Casa': '/icon/house.svg',
        'Cuarto': '/icon/room.svg',
        'Departamento': '/icon/building.svg',
        'Limpieza': '/icon/cleaning.png',
        'Gas': '/icon/gas.png',
        'Luz': '/icon/power.png',
        'TV cable': '/icon/television.png',
        'Agua': '/icon/water-tap.png',
        'Wifi': '/icon/wifi.png',
        'Boiler': '/icon/boiler.png',
        'Lavadora': '/icon/washing-machine.png',
        'Estacionamiento': '/icon/parking.png',
        'Cocina': '/icon/kitchen.png',
        'Refrigerador': '/icon/fridge.png',
        'Comedor': '/icon/chair.png',
        'Patio': '/icon/fence.png',
        'Sala de estar': '/icon/sofa.png',
        'Área de lavado': '/icon/area-lavado.png',
        'Aire acondicionado': '/icon/ac.png'
    }

    return iconos[inmueble];
}

export default function Confirmar() {
    const { inmueble } = useFormulario();

    const {
        tipoInmueble,
        servicios,
        amenidades,
        numRecamaras,
        numCamas,
        numBanos,
        numHuespedes,
        capEstacionamiento,
        fotos,
        ubicacion,
        titulo,
        descripcion,
        reglas,
        precio
    } = inmueble;

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
    } = ubicacion;

    const Imagen1 = URL.createObjectURL(fotos[0]);
    const Imagen2 = URL.createObjectURL(fotos[1]);
    const Imagen3 = URL.createObjectURL(fotos[2]);

    return (
        <section className="w-full mx-auto p-2">
            <div className='mb-12 text-center'>
                <h2 className="font-semibold text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                    Confirmar los datos del inmueble
                </h2>
                <p
                    className="text-sm mb-8 text-neutral-800 dark:text-gray-400"
                >
                    Por favor revisa los datos del inmueble antes de continuar
                </p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:max-w-5xl lg:gap-x-20 lg:grid-cols-2">
                <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1">
                    <h1
                        className="mt-1 text-lg font-semibold text-white sm:text-slate-900 md:text-2xl dark:sm:text-white"
                    >
                        {titulo}
                    </h1>
                    <p
                        className="text-sm leading-4 font-medium text-white sm:text-slate-500 dark:sm:text-slate-400"
                    >
                        Propiedad
                    </p>
                </div>
                {/* Imágenes */}
                <div className="grid gap-4 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                    <Image
                        width={800}
                        height={800}
                        src={Imagen1}
                        alt=""
                        className="w-full h-60 object-cover rounded-lg sm:h-52 sm:col-span-2 lg:col-span-full"
                    />
                    <Image
                        width={800}
                        height={800}
                        src={Imagen2}
                        alt=""
                        className="hidden w-full h-52 object-cover rounded-lg sm:block sm:col-span-2 md:col-span-1 lg:row-start-2 lg:col-span-2 lg:h-32"
                    />
                    <Image
                        width={800}
                        height={800}
                        src={Imagen3}
                        alt=""
                        className="hidden w-full h-52 object-cover rounded-lg md:block lg:row-start-2 lg:col-span-2 lg:h-32"
                    />
                </div>
                <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
                    <dt className="sr-only">Reviews</dt>
                    <dd className="text-indigo-600 flex items-center dark:text-indigo-400">
                        <Star size={18} className="mr-1" />
                        <span>0.0 <span className="text-slate-400 font-normal">(0)</span></span>
                    </dd>
                    <dt className="sr-only">Location</dt>
                    <dd className="flex items-center text-neutral-700 dark:text-neutral-200">
                        <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mx-3 text-slate-300">
                            <circle cx="1" cy="1" r="1" />
                        </svg>
                        <MapPin size={18} className="mr-1" />
                        {ciudad_municipio}, {estado}
                    </dd>
                </dl>
                <div className="mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-6 lg:col-start-1 lg:row-start-3 lg:row-end-4">
                    <Chip color="primary" variant="flat" size="sm" radius="sm">
                        {`Tipo ${tipoInmueble}`}
                    </Chip>
                </div>
                <p
                    className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-6 lg:row-start-4 lg:col-span-1 dark:text-slate-400"
                >
                    {descripcion}
                </p>
            </div>
            <div className="my-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="mx-auto my-5 p-2">
                        <DynamicMap
                            position={[latitud, longitud]}
                            zoom={16}
                            style="rounded-md p-2 w-[400px] h-[400px] w-full"
                        />
                    </div>
                    <div>
                        <h3
                            className="font-semibold text-sm sm:text-base my-5 text-blue-600 dark:text-blue-400">
                            Ubicación
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto">
                            {/* Campos de la ubicación */}
                            {/* Dirección */}
                            <div className="relative col-span-1 md:col-span-2 z-0 w-full mb-2 group">
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
                            {/* Pais */}
                            <div className="relative z-0 w-full mb-2 group">
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
                            {/* Estado */}
                            <div className="relative z-0 w-full mb-2 group">
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
                            {/* Ciudad / Municipio */}
                            <div className="relative z-0 w-full mb-2 group">
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
                            {/* Código Postal */}
                            <div className="relative z-0 w-full mb-2 group">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                                {/* Número exterior */}
                                <div className="relative z-0 w-full mb-5 group pr-2">
                                    <input
                                        type="text"
                                        name="numExt"
                                        id="numExt"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=""
                                        autoComplete="off"
                                        disabled={true}
                                        value={numExt}
                                    />
                                    <label
                                        htmlFor="numExt"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Núm.Ext
                                    </label>
                                </div>
                                {
                                    !inputVacio(numInt) &&
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            type="text"
                                            name="numInt"
                                            id="numInt"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=""
                                            autoComplete="off"
                                            disabled={true}
                                            value={numInt}
                                        />
                                        <label
                                            htmlFor="numInt"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Núm.Int
                                        </label>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <h3
                    className="font-semibold text-sm sm:text-base my-3 text-blue-600 dark:text-blue-400">
                    Servicios y amenidades
                </h3>
                <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {/* contenedor de servicios */}
                        {
                            servicios.map((servicio, index) => {
                                const icono = getIcon(servicio);
                                return (
                                    <div
                                        key={index}
                                        className="rounded-md text-center text-xs md:text-sm px-5 py-3 flex flex-col items-center text-neutral-900 bg-gray-200 dark:text-gray-200 dark:bg-blue-500"
                                    >
                                        <Image
                                            src={icono}
                                            width={40}
                                            height={40}
                                            alt={`Icono de ${servicio}`}
                                            className="filter dark:invert"
                                        />
                                        {servicio}
                                    </div>
                                );
                            })
                        }
                        {
                            amenidades.map((amenidad, index) => {
                                const icono = getIcon(amenidad);
                                return (
                                    <div
                                        key={index}
                                        className="rounded-md text-center text-xs md:text-sm px-5 py-3 flex flex-col items-center text-neutral-900 bg-gray-200 dark:text-gray-200 dark:bg-blue-500"
                                    >
                                        <Image
                                            src={icono}
                                            width={40}
                                            height={40}
                                            alt={`Icono de ${amenidad}`}
                                            className="filter dark:invert"
                                        />
                                        {amenidad}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <h3
                        className="font-semibold text-sm sm:text-base my-3 text-blue-600 dark:text-blue-400">
                        Información general del inmueble
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mx-auto">
                        {/* Beds */}
                        <div className="w-full bg-blue-200 p-3 mt-3 flex justify-between rounded-md">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-500 rounded-full">
                                    <Image
                                        src={'/icon/beds.png'}
                                        width={30}
                                        height={30}
                                        alt={`Icono de camas`}
                                        className="filter dark:invert"
                                    />
                                </div>
                                <div className="ms-2 text-blue-500">
                                    <h3
                                        className="font-semibold text-sm sm:text-base">
                                        Camas
                                    </h3>
                                    <p className="text-xs text-neutral-800">
                                        {`Cantidad: (${numCamas})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Parking */}
                        <div className="w-full bg-blue-200 p-3 mt-3 flex justify-between rounded-md">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-500 rounded-full">
                                    <Image
                                        src={'/icon/parking.png'}
                                        width={30}
                                        height={30}
                                        alt={`Icono de estacionamiento`}
                                        className="filter dark:invert"
                                    />
                                </div>
                                <div className="ms-2 text-blue-500">
                                    <h3
                                        className="font-semibold text-sm sm:text-base">
                                        Estacionamiento
                                    </h3>
                                    <p className="text-xs text-neutral-800">
                                        {
                                            amenidades.includes('Estacionamiento') ?
                                                `Capacidad: (${capEstacionamiento})` :
                                                'No cuenta con estacionamiento'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Huespedes */}
                        <div className="w-full bg-blue-200 p-3 mt-3 flex justify-between rounded-md">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-500 rounded-full">
                                    <Image
                                        src={'/icon/people.png'}
                                        width={30}
                                        height={30}
                                        alt={`Icono de huespedes`}
                                        className="filter dark:invert"
                                    />
                                </div>
                                <div className="ms-2 text-blue-500">
                                    <h3
                                        className="font-semibold text-sm sm:text-base">
                                        Huespedes
                                    </h3>
                                    <p className="text-xs text-neutral-800">
                                        {`Cantidad: (${numHuespedes})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Bedroom */}
                        <div className="w-full bg-blue-200 p-3 mt-3 flex justify-between rounded-md">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-500 rounded-full">
                                    <Image
                                        src={'/icon/bedroom-furniture.png'}
                                        width={30}
                                        height={30}
                                        alt={`Icono de recámara`}
                                        className="filter dark:invert"
                                    />
                                </div>
                                <div className="ms-2 text-blue-500">
                                    <h3
                                        className="font-semibold text-sm sm:text-base">
                                        Recámaras
                                    </h3>
                                    <p className="text-xs text-neutral-800">
                                        {`Cantidad: (${numRecamaras})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Bathroom */}
                        <div className="w-full bg-blue-200 p-3 mt-3 flex justify-between rounded-md">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-500 rounded-full">
                                    <Image
                                        src={'/icon/bathroom-cabinet.png'}
                                        width={30}
                                        height={30}
                                        alt={`Icono de baño`}
                                        className="filter dark:invert"
                                    />
                                </div>
                                <div className="ms-2 text-blue-500">
                                    <h3
                                        className="font-semibold text-sm sm:text-base">
                                        Baños
                                    </h3>
                                    <p className="text-xs text-neutral-800">
                                        {`Cantidad: (${numBanos})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3
                        className="font-semibold text-sm sm:text-base my-3 text-blue-600 dark:text-blue-400">
                        Restricciones
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {
                            reglas.map((regla, index) =>
                                <Chip
                                    key={index}
                                    color="primary"
                                    variant="flat"
                                >
                                    {regla}
                                </Chip>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="my-5">
                <h3
                    className="font-semibold text-sm sm:text-base my-5 text-blue-600 dark:text-blue-400">
                    Fotografías del inmueble
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                    {
                        fotos.map((imagen, index) => {
                            const url = URL.createObjectURL(imagen);
                            return (
                                <div key={index} className="relative group w-full h-0 pb-[100%]">
                                    <Image
                                        src={url}
                                        alt={`Imagen de inmueble ${index}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg"
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </section >
    );
}