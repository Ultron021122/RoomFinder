'use client';

import { useState, useEffect } from "react";
import { useFormulario } from "./FormularioContext";
import Image from 'next/image';
import { inputVacio } from "./Wizar";
import { Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { DoorClosed, DoorOpen, MapPin, Star, Text } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Badge } from "../ui/badge";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay"
import { Button } from "../ui/button";
import { ImageOverlay } from "../Propiedades/image-overlay";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const DynamicMap = dynamic(() => import("@/components/Form/Map"),
    {
        ssr: false,
        loading: () => <Spinner />,
    });

function getIcon(inmueble: string) {
    const iconos: Record<string, { icon: string, serviceName: string }> = {
        'bnCleaningIncluded': { icon: '/icon/cleaning.png', serviceName: 'Limpieza' },
        "bnGasIncluded": { icon: '/icon/gas.png', serviceName: 'Gas' },
        "bnElectricityIncluded": { icon: '/icon/power.png', serviceName: 'Electricidad' },
        "bnCableTVIncluded": { icon: '/icon/television.png', serviceName: 'TV por cable' },
        "bnWaterIncluded": { icon: '/icon/water-tap.png', serviceName: 'Agua' },
        "bnInternetIncluded": { icon: '/icon/wifi.png', serviceName: 'Internet' },
        "bnHeatingIncluded": { icon: '/icon/boiler.png', serviceName: 'Calefacción' },
        "bnWashingMachineIncluded": { icon: '/icon/washing-machine.png', serviceName: 'Lavadora' },
        "bnParkingIncluded": { icon: '/icon/parking.png', serviceName: 'Estacionamiento' },
        "bnKitchen": { icon: '/icon/kitchen.png', serviceName: 'Cocina' },
        "bnCoolerIncluded": { icon: '/icon/fridge.png', serviceName: 'Refrigerador' },
        "bnDiningRoom": { icon: '/icon/chair.png', serviceName: 'Comedor' },
        "bnGardenIncluded": { icon: '/icon/fence.png', serviceName: 'Jardín' },
        "bnLivingRoom": { icon: '/icon/sofa.png', serviceName: 'Sala de estar' },
        "bnWashingArea": { icon: '/icon/area-lavado.png', serviceName: 'Área de lavado' },
        "bnAirConditioningIncluded": { icon: '/icon/ac.png', serviceName: 'Aire acondicionado' }
    };

    return iconos[inmueble] || { icon: '', serviceName: 'Servicio no encontrado' };
}

export default function Confirmar() {
    const { inmueble, setInmueble } = useFormulario();
    const [valor, setValor] = useState<number | null>(inmueble.precio);
    const [dialogoAbierto, setDialogoAbierto] = useState<boolean>(false);

    const {
        tipoInmueble,
        servicios,
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

    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    const objphotos = fotos.map((url, index) => ({
        url: url,
        photoid: index + 1
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const precio = value ? parseFloat(value) : 0;
        setValor(precio);
    };

    const handleConfirm = () => {
        if (valor !== null && !isNaN(valor) && valor > 0) {
            setInmueble({ ...inmueble, precio: valor });
            setDialogoAbierto(false);
        } else {
            setDialogoAbierto(false);
        }
    };

    return (
        <section className="w-full mx-auto p-2">
            <div className="mb-4">
                <h2 className="font-semibold text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                    Confirmar los datos del inmueble
                </h2>
                <p
                    className="text-sm mb-8 text-neutral-800 dark:text-gray-400"
                >
                    Por favor revisa los datos del inmueble antes de continuar
                </p>
                <Button
                    onClick={() => setDialogoAbierto(true)}
                    className="w-full"
                >
                    Agregar precio
                </Button>
            </div>
            <div className="bg-gradient-to-b min-h-screen">
                {/* Hero Section */}
                <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:max-w-7xl lg:gap-x-20 lg:grid-cols-2">
                        <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1 z-30">
                            <h1 className="mt-1 text-lg font-semibold text-white sm:text-slate-900 md:text-2xl dark:sm:text-white">
                                {titulo}
                            </h1>
                            <p className="text-sm leading-4 font-medium text-white sm:text-slate-500 dark:sm:text-slate-400">
                                Propiedad
                            </p>
                        </div>
                        <div className="grid gap-2 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-2 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                            <div className="relative sm:h-52 sm:col-span-2 lg:col-span-full">
                                <Image
                                    width={800}
                                    height={800}
                                    src={objphotos?.[0]?.url || "/No_image.png"}
                                    alt={`Imagen ${objphotos?.[0]?.photoid || "No disponible"}`}
                                    priority
                                    className="w-full h-60 object-cover rounded-lg shadow-lg sm:h-52 sm:col-span-2 lg:col-span-full hover:opacity-95 transition-opacity"
                                />
                                {objphotos && <ImageOverlay images={objphotos} />}
                            </div>
                            <Image
                                width={800}
                                height={800}
                                src={objphotos?.[1]?.url || "/No_image.png"}
                                alt={`Imagen ${objphotos?.[1]?.photoid || "No disponible"}`}
                                className="hidden w-full h-52 object-cover rounded-lg shadow-lg sm:block sm:col-span-2 md:col-span-1 lg:row-start-2 lg:col-span-2 lg:h-32 hover:opacity-95 transition-opacity"
                                priority
                            />
                            <Image
                                width={800}
                                height={800}
                                src={objphotos?.[2]?.url || "/No_image.png"}
                                alt={`Imagen ${objphotos?.[2]?.photoid || "No disponible"}`}
                                className="hidden w-full h-52 object-cover rounded-lg shadow-lg md:block lg:row-start-2 lg:col-span-2 lg:h-32 hover:opacity-95 transition-opacity"
                                priority
                            />
                        </div>
                        <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
                            <dt className="sr-only">Reviews</dt>
                            <dd className="text-blue-600 flex items-center dark:text-blue-400">
                                <Star size={18} className="mr-1 fill-current" />
                                <span className="font-bold">1.0</span>
                            </dd>
                            <dt className="sr-only">Location</dt>
                            <dd className="flex items-center text-neutral-700 dark:text-neutral-200">
                                <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mx-3 text-slate-300">
                                    <circle cx="1" cy="1" r="1" />
                                </svg>
                                <MapPin size={18} className="mr-1 text-gray-600 dark:text-gray-400" />
                                <span>{direccion}</span>
                            </dd>
                        </dl>
                        <div className="mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-4 lg:col-start-1 lg:row-start-3 lg:row-end-4">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 transition-colors">
                                {`Tipo ${tipoInmueble === 1 ? 'Casa' : tipoInmueble === 2 ? 'Habitación' : 'Departamento'}`}
                            </Badge>
                        </div>
                        <p className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-4 lg:row-start-4 lg:col-span-1 dark:text-slate-300">
                            {descripcion}
                        </p>
                    </div>
                </main>
                <div className="pb-6 px-4 sm:p-6 md:pb-10 md:px-8">
                    <h2
                        className="font-semibold text-base sm:text-lg mb-2 text-blue-600 dark:text-blue-400">
                        Detalles de la propiedad
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Se muestran los detalles sobre la propiedad entre ellos los servicios y amenidades.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="px-4">
                            <h3 className="font-semibold text-sm sm:text-base my-5 text-blue-600 dark:text-blue-400">
                                Servicios y amenidades
                            </h3>
                            <div>
                                {/* Contenedor de servicios */}
                                <ul className="mt-2 list-disc list-inside">
                                    {
                                        // Aquí recorremos los servicios y mostramos el ícono y nombre de cada uno
                                        Object.entries(servicios).map(([key, value], index) => {
                                            // Solo mostramos los servicios que están habilitados (true)
                                            if (value) {
                                                const servicio = getIcon(key); // Obtener el ícono según el servicio
                                                return (
                                                    <li key={index} className="text-sm text-muted-foreground flex items-center space-x-2 mb-2">
                                                        <Image
                                                            src={servicio.icon}
                                                            width={20}
                                                            height={20}
                                                            alt={`Icono de ${key}`}
                                                            className="filter dark:invert"
                                                        />
                                                        <span>
                                                            {servicio.serviceName}
                                                        </span>
                                                    </li>
                                                );
                                            }
                                            return null;
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 my-5">Reglas</h3>
                            <ul className="mt-2 list-disc list-inside">
                                {reglas.map((regla, index) => (
                                    <li key={index} className="text-sm text-muted-foreground">{regla}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="px-9">
                    <Carousel
                        className="hidden w-full mx-auto lg:block lg:col-span-full"
                        plugins={[plugin.current]}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent>
                            {fotos.map((foto, index) => {
                                const url = foto;
                                return (
                                    <CarouselItem className="basis-1/2" key={index}>
                                        <Image
                                            src={url}
                                            alt={`Imagen del inmueble ${index + 1}`}
                                            width={400}
                                            height={300}
                                            className="carousel-image rounded-lg object-cover"
                                        />
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                <div className="container mx-auto px-4 pb-S6 md:py-5 max-w-5xl lg:max-w-7xl">
                    <div className="mt-6 px-2">
                        <h3
                            className="font-semibold text-base sm:text-lg mb-2 text-blue-600 dark:text-blue-400">
                            Ubicación propiedad
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto">
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-primary-300" />
                                <span className="text-sm dark:text-primary-foreground">{direccion}</span>
                            </div>
                            <div className="flex items-center">
                                <Text className="h-5 w-5 mr-2 text-primary-300" />
                                <span className="text-sm dark:text-primary-foreground">{pais}</span>
                            </div>
                            <div className="flex items-center">
                                <Text className="h-5 w-5 mr-2 text-primary-300" />
                                <span className="text-sm dark:text-primary-foreground">{estado}</span>
                            </div>
                            <div className="flex items-center">
                                <Text className="h-5 w-5 mr-2 text-primary-300" />
                                <span className="text-sm dark:text-primary-foreground">{ciudad_municipio}</span>
                            </div>
                            <div className="flex items-center">
                                <Text className="h-5 w-5 mr-2 text-primary-300" />
                                <span className="text-sm dark:text-primary-foreground">{codigoPostal}</span>
                            </div>
                            <div className="flex items-center">
                                <DoorClosed className="h-5 w-5 mr-2 text-primary-300" />
                                <span className="text-sm dark:text-primary-foreground">{numExt}</span>
                            </div>
                            {!inputVacio(numInt) &&
                                <div className="flex items-center">
                                    <DoorOpen className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className="text-sm dark:text-primary-foreground">{numInt}</span>
                                </div>
                            }
                        </div>
                    </div>
                    <section className="mt-10 mb-14 space-y-4">
                        <DynamicMap
                            position={[latitud, longitud]}
                            zoom={16}
                            style="rounded-md shadow-lg h-96 w-96 w-full mx-auto mt-6 z-10"
                        />
                    </section>
                </div>
            </div>
            <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                <DialogContent
                    aria-describedby="update_element"
                    className="w-screen sm:w-full max-w-lg"
                >
                    <DialogHeader>
                        <DialogTitle>Renta mensual</DialogTitle>
                        <DialogDescription>
                            Ingresa un valor para el precio del inmueble
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="precio" className="text-right">
                            Precio
                        </Label>
                        <Input
                            id="precio"
                            type="number"
                            value={valor !== null ? valor.toString() : ''}
                            className="col-span-3"
                            onChange={handleChange}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDialogoAbierto(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirm}>
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}