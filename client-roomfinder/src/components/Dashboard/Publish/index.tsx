'use client';

import ImageElement from "@/components/GeneralComponents/ImageElement";
import Image from "next/image";
import React, { useState } from "react";
import { Progress } from "@nextui-org/react";
import { useForm } from "react-hook-form";

const ImageElementStyles = {
    width: 40,
    height: 40,
    style:"flex gap-2 border border-gray-500 p-4 rounded-lg w-[250px] justify-center items-center hover:border-black"
}

export default function Publish(){
    return (
        <div className="h-screen">
            <Header/>
            <Wizar/>
        </div>
    );
}

interface Inmueble {
    tipoInmueble:'',
    descripcion:'',
    servicios:[],
    amenidades:[],
    ocupantes:'',
    reglas:[],
    costo:''
}

const Wizar = () => {
    const [actual, setActual] = useState(1);
    const {register, handleSubmit, formState : {errors}, setValue, getValues} = useForm<Inmueble>();

    const siguiente = () => {
        setActual((prev) => prev + 1);
    }

    const anterior = () => {
        setActual((prev) => prev - 1);
    }

    const onSubmit = (data : Inmueble) => {
        // mandar los datos a la base de datos
        console.log(data);
    }

    const estiloBoton = {
        style:"text-center bg-[#007aff] p-4 rounded-lg w-[150px] text-white font-semibold text-lg hover:bg-opacity-90"
    }

    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-[95%] mx-auto mt-10 h-[500px] overflow-hidden overflow-y-auto">
                    {actual === 1 && <TipoInmueble/>}
                    {actual === 2 && <ServiciosAmenidades/>}
                    {actual === 3 && <Fotos/>}
                    {actual === 4 && <Ubicacion/>}
                    {actual === 5 && <Detalles/>}
                    {actual === 6 && <Confirmacion/>}
                </div>
                <div className="w-[95%] mx-auto">
                    <Progress size="sm" aria-label="Loading..." value={(actual / 6) * 100}/>
                    <div className="flex justify-between my-10">
                        {
                            actual > 1 && <Boton contenido="Anterior" onClick={anterior} style={estiloBoton.style} />
                        }
                        
                        {
                            actual < 6 ? <Boton contenido="Siguiente" onClick={siguiente} style={estiloBoton.style}/> : (
                                <Boton contenido="Publicar" onClick={onSubmit} style={estiloBoton.style}/>
                            )
                        }
                    </div>
                </div>
            </form>
        </>
    );
}

const Header = () => {
    return(
        <header className="relative h-72">
            <Image
                src={'/background/fondo-7.jpg'}
                alt=""
                layout="fill"
                objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 grid grid-cols-1 place-items-center">
                <h1 className="text-4xl text-white font-bold">Publicar inmueble</h1>
            </div>
        </header>
    );
}

const Boton = ({contenido, onClick, style}:{contenido:string, onClick:any, style:string}) => {
    return(
        <button
            onClick={onClick}
            className={style}
        >
            {contenido}
        </button>
    );
}

const TipoInmueble = () => {

    const tiposInmueble = [
        {icon:'/icon/house.svg', content:'Casa'},
        {icon:'/icon/room.svg', content:'Cuarto'},
        {icon:'/icon/building.svg', content:'Departamento'},
    ]

    return(
        <div className="h-full">
            <h2 className="text-center font-semibold text-3xl mb-10">Seleccione el tipo de inmueble a publicar</h2>
            <div className="h-[65%] flex justify-evenly items-center">
                {
                    tiposInmueble.map( (data, index) => 
                        <ImageElement
                            key={index}
                            icon={data.icon}
                            content={data.content}
                            width={ImageElementStyles.width}
                            height={ImageElementStyles.height}
                            style={ImageElementStyles.style}
                        />
                    )
                }
            </div>
        </div>
    );
}

const ServiciosAmenidades = () => {

    const ServiciosData = [
        {icon: '/icon/cleaning.png', content: 'Limpieza'},
        {icon: '/icon/gas.png', content: 'Gas'},
        {icon: '/icon/power.png', content: 'Electricidad'},
        {icon: '/icon/television.png', content: 'TV cable'},
        {icon: '/icon/water-tap.png', content: 'Agua'},
        {icon: '/icon/washing-machine.png', content: 'Lavadora'},
        {icon: '/icon/wifi.png', content: 'Wifi'},
        {icon: '/icon/parking.png', content:'Estacionamiento'},
        {icon: '/icon/kitchen.png', content:'Cocina'},
        {icon: '/icon/chair.png', content:'Comedor'},
        {icon: '/icon/fence.png', content:'Patio'},
        {icon: '/icon/fridge.png', content:'Refrigerador'},
        {icon: '/icon/sofa.png', content:'Sala de estar'},
    ];

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Servicios y Amenidades</h2>
            <p className="text-xl mb-8">Selecciona los servicios con los cuenta el inmueble</p>
            <div className="grid grid-cols-4 gap-y-8">
                {
                    ServiciosData.map((data, index) =>
                        <ImageElement
                            key={index}
                            icon={data.icon}
                            content={data.content}
                            width={ImageElementStyles.width}
                            height={ImageElementStyles.height}
                            style={ImageElementStyles.style}
                        />
                    )
                }
            </div>
            <CaracteristicasInmueble/>
        </div>
    );
}

const CaracteristicasInmueble = () => {
    return(
        <div>
            <p className="text-xl mb-8 mt-8">Información general del inmueble</p>

        </div>
    );
}

const Fotos:React.FC = () => {

    const [imagenes, setImagenes] = useState<File[]>([]);
    const [imagenesPreview, setImagenesPreview] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if(files){
            const fileArray = Array.from(files);
            setImagenes(fileArray);

            // generar previsualizaciones de las imagenes
            const previews = fileArray.map( file => URL.createObjectURL(file));
            setImagenesPreview(previews);
        }
    };

    const handleClear = () => {
        setImagenes([]);
        setImagenesPreview([]);
    };

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Agrega algunas fotos de tu inmueble a rentar</h2>
            <p className="text-xl mb-8">Para iniciar se necesitan como mínimo 5 fotografías. Más adelante podrás agregar más y realizar cambios</p>

            <Boton
                contenido="Seleccionar imagenes"
                style=""
                onClick={handleClear}
            />
        </div>
    );
}

const Ubicacion = () => {
    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Selecciona la ubicación del inmueble</h2>
            <p className="text-xl mb-8">Es necesario que indiques donde se ubica el inmueble para que los alumnos conozcan su ubicación</p>
        </div>
    );
}

const Detalles = () => {
    return(
        <div>
            <h2>Describe </h2>
        </div>
    );
}

const Confirmacion = () => {
    return(
        <div>

        </div>
    );
}
