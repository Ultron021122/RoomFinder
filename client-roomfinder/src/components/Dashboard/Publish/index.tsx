'use client';

import ImageElement from "@/components/GeneralComponents/ImageElement";
import Image from "next/image";
import React, { useState } from "react";
import { Progress } from "@nextui-org/react";
import clsx from 'clsx';
import { FormularioProvider, useFormulario } from "./FormularioContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ImageElementStyles = {
    width: 40,
    height: 40,
    style:"flex gap-2 border border-gray-500 p-4 rounded-lg w-[250px] justify-center items-center hover:border-black hover:cursor-pointer"
}

export default function Publish(){
    return (
        <div className="h-screen">
            <Header/>
            <FormularioProvider>
                <Wizar/>
            </FormularioProvider>
        </div>
    );
}

const Wizar = () => {
    const [actual, setActual] = useState(1);
    const { inmueble } = useFormulario();

    const siguiente = () => {
        let pasa = true;

        switch(actual){
            case 1:
                if(inmueble.tipoInmueble != ''){
                    pasa = true;
                }else{
                    toast.error('Selecciona un tipo de inmueble para continuar');
                    <ToastContainer/>
                }
            break;

            case 2:
            break;

            case 3:
            break;

            case 4:
            break;

            case 5:
            break;

            case 6:
            break;

            default:
            break;
        }

        if(pasa){
            setActual((prev) => prev + 1);
        }
    }

    const anterior = () => {
        setActual((prev) => prev - 1);
    }

    const estiloBoton = {
        style:"text-center bg-[#007aff] p-4 rounded-lg w-[150px] text-white font-semibold text-lg hover:bg-opacity-90"
    }

    return(
        <div>
            <div className="w-[95%] mx-auto mt-10 h-[500px] overflow-hidden overflow-y-auto">
                {actual === 1 && <TipoInmueble/>}
                {actual === 2 && <ServiciosAmenidades/>}
                {actual === 3 && <InformacionGeneral/>}
                {actual === 4 && <Fotos/>}
                {actual === 5 && <Ubicacion/>}
                {actual === 6 && <Detalles/>}
                {actual === 7 && <Confirmacion/>}
            </div>
            <div className="w-[95%] mx-auto">
                <Progress size="sm" aria-label="Loading..." value={(actual / 7) * 100}/>
                <div className="flex justify-between my-10">
                    {
                        actual > 1 && <Boton contenido="Anterior" onClick={anterior} style={estiloBoton.style} />
                    }
                    
                    {
                        actual < 7 ? <Boton contenido="Siguiente" onClick={siguiente} style={estiloBoton.style}/> : (
                            <Boton contenido="Enviar" onClick={null} style={estiloBoton.style}/>
                        )
                    }
                </div>
            </div>
        </div>
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

const TipoInmueble = () => {
    const { inmueble ,setInmueble } = useFormulario();

    const handleSelect = (tipo : string) => {
        setInmueble({tipoInmueble:tipo});
    }

    const tiposInmueble = [
        {icon:'/icon/house.svg', content:'Casa'},
        {icon:'/icon/room.svg', content:'Cuarto'},
        {icon:'/icon/building.svg', content:'Departamento'}
    ];

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
                            style={clsx(
                                ImageElementStyles.style,
                                {
                                    'bg-zinc-300' : data.content === inmueble.tipoInmueble
                                }
                            )}
                            onClick={() => handleSelect(data.content)}
                        />
                    )
                }
            </div>
        </div>
    );
}

const ServiciosAmenidades = () => {
    const { inmueble, setInmueble } = useFormulario();

    const ServiciosData = [
        {icon: '/icon/cleaning.png', content: 'Limpieza'},
        {icon: '/icon/gas.png', content: 'Gas'},
        {icon: '/icon/power.png', content: 'Luz'},
        {icon: '/icon/television.png', content: 'TV cable'},
        {icon: '/icon/water-tap.png', content: 'Agua'},
        {icon: '/icon/wifi.png', content: 'Wifi'},
        {icon: '/icon/boiler.png', content: 'Boiler'}
    ];

    const AmenidadesData = [
        {icon: '/icon/washing-machine.png', content: 'Lavadora'},
        {icon: '/icon/parking.png', content:'Estacionamiento'},
        {icon: '/icon/kitchen.png', content:'Cocina'},
        {icon: '/icon/fridge.png', content:'Refrigerador'},
        {icon: '/icon/chair.png', content:'Comedor'},
        {icon: '/icon/fence.png', content:'Patio'},
        {icon: '/icon/sofa.png', content:'Sala de estar'},
        {icon: '/icon/area-lavado.png', content: 'Área de lavado'},
        {icon: '/icon/ac.png', content: 'Aire acondicionado'}
    ]

    const handleServicio = (servicio : string) => {

        const serviciosActuales = inmueble.servicios;
        let nuevosServicios : string[] = [];

        if(serviciosActuales.includes(servicio)){
            nuevosServicios = serviciosActuales.filter((s) => {
                return s !== servicio;
            })
        }else{
            nuevosServicios = [...serviciosActuales, servicio];
        }

        setInmueble({servicios: nuevosServicios})
    }

    const handleAmenidad = (amenidad : string) => {

        const amenidadesAct = inmueble.amenidades;
        let nuevasAmenidades : string[] = []

        if(amenidadesAct.includes(amenidad)){
            nuevasAmenidades = amenidadesAct.filter(a => {
                return a !== amenidad;
            });
        }else{
            nuevasAmenidades = [...amenidadesAct, amenidad];
        }

        setInmueble({amenidades:nuevasAmenidades})
    }

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Servicios y Amenidades</h2>
            <p className="text-xl mb-8">Selecciona los servicios que incluye el inmueble</p>
            <div className="grid grid-cols-4 gap-y-8">
                {
                    ServiciosData.map((data, index) =>
                        <ImageElement
                            key={index}
                            icon={data.icon}
                            content={data.content}
                            width={ImageElementStyles.width}
                            height={ImageElementStyles.height}
                            style={clsx(
                                ImageElementStyles.style,
                                {
                                    'bg-zinc-300' : inmueble.servicios.includes(data.content)
                                }
                            )

                            }
                            onClick={() => handleServicio(data.content)}
                        />
                    )
                }
            </div>
            <p className="text-xl my-8">Selecciona las amenidades que tiene el inmueble</p>
            <div className="grid grid-cols-4 gap-y-8">
                {
                    AmenidadesData.map((data, index) =>
                        <ImageElement
                            key={index}
                            icon={data.icon}
                            content={data.content}
                            width={ImageElementStyles.width}
                            height={ImageElementStyles.height}
                            style={clsx(
                                ImageElementStyles.style,
                                {
                                    'bg-zinc-300' : inmueble.amenidades.includes(data.content)
                                }
                            )

                            }
                            onClick={() => handleAmenidad(data.content)}
                        />
                    )
                }
            </div>
        </div>
    );
}

const estBtn = 'absolute flex justify-center items-center w-[35px] h-[35px] rounded-full border border-solid border-gray-500 text-gray-500';

const Campo = ({content, min, max} : {content:string, min:number, max:number}) => {
    const {inmueble, setInmueble} = useFormulario();

    const incrementar = () => {
        const propiedad = obtenerPropiedad(content);
        let valorActual = inmueble[propiedad];
        setInmueble({[propiedad] : valorActual < max ? valorActual + 1 : valorActual});
    }

    const decrementar = () => {
        const propiedad = obtenerPropiedad(content);
        let valorActual = inmueble[propiedad];
        setInmueble({[propiedad] : valorActual > min ? valorActual - 1 : valorActual});
    }

    const obtenerPropiedad = (campo: string) => {
        const campos : Record<string, string> = {
            'Recámaras' : 'numRecamaras',
            'Camas' : 'numCamas',
            'Baños' : 'numBanos',
            'Huéspedes' : 'numHuespedes'
        }

        return campos[campo];
    }

    const propiedad = obtenerPropiedad(content);

    return(
        <div className="flex items-center justify-between border-b-1 border-gray-300 py-5 w-[85%] mx-auto">
            <p className="text-lg">{content}</p>
            <div className="relative flex gap-8 items-center w-32">
                <Boton
                    contenido="-"
                    onClick={decrementar}
                    style={clsx(
                        `${estBtn} left-0`,
                        {
                            'hover:cursor-not-allowed border-zinc-300 text-zinc-300' : inmueble[propiedad] === min
                        }
                    )}
                />

                <p className="absolute left-[60px]">{inmueble[propiedad]}</p>
                
                <Boton
                    contenido="+"
                    onClick={incrementar}
                    style={clsx(
                        `${estBtn} right-0`,
                        {
                            'hover:cursor-not-allowed border-zinc-300 text-zinc-300 ' : inmueble[propiedad] === max
                        }
                    )}
                />
            </div>
        </div>
    );
}

const Casa = {
    recamaras: {min: 1, max: 15},
    camas: {min: 1, max: 20},
    banos: {min: 1, max: 18},
    huespedes: {min: 1, max: 30}
}

const Cuarto = {
    huespedes : {min: 1, max : 4},
    camas: {min:1, max: 4}

}

const Departamento = {
    recamaras: {min: 1, max : 4},
    camas: {min: 1, max: 4},
    banos: {min: 1, max: 3},
    huespedes: {min: 1, max: 6}
}

const InformacionGeneral = () => {
    const {inmueble, setInmueble} = useFormulario();

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Información general del inmueble</h2>
            {inmueble.tipoInmueble === 'Casa' &&
                <div className="flex flex-col gap-4">
                    <Campo content="Recámaras" min={Casa.recamaras.min} max={Casa.recamaras.max}/>
                    <Campo content="Camas" min={Casa.camas.min} max={Casa.camas.max}/>
                    <Campo content="Baños" min={Casa.banos.min} max={Casa.banos.max}/>
                    <Campo content="Huéspedes" min={Casa.huespedes.min} max={Casa.huespedes.max}/>
                </div>
            }

            {inmueble.tipoInmueble === 'Cuarto' && (
                <div className="flex flex-col gap-4">
                    <Campo content="Huéspedes" min={Cuarto.huespedes.min} max={Cuarto.huespedes.max}/>
                    <Campo content="Camas" min={Cuarto.camas.min} max={Cuarto.camas.max}/>
                </div>
            )}

            {inmueble.tipoInmueble === 'Departamento' && (
                <div className="flex flex-col gap-4">
                    <Campo content="Recámaras" min={Departamento.recamaras.min} max={Departamento.recamaras.max}/>
                    <Campo content="Camas" min={Departamento.camas.min} max={Departamento.camas.max}/>
                    <Campo content="Baños" min={Departamento.banos.min} max={Departamento.banos.max}/>
                    <Campo content="Huéspedes" min={Departamento.huespedes.min} max={Departamento.huespedes.max}/>
                </div>
            )}
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
