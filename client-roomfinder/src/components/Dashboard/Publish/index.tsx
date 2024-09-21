'use client';

import ImageElement from "@/components/GeneralComponents/ImageElement";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Progress } from "@nextui-org/react";
import clsx from 'clsx';
import { FormularioProvider, useFormulario } from "./FormularioContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Inmueble } from "./FormularioContext";
import { useDropzone} from 'react-dropzone';

// módulos para el mapa
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl, {Map} from "mapbox-gl";

/*
import Map, { Marker, MapRef } from 'react-map-gl'; // Importa MapRef
import mapboxgl from 'mapbox-gl'; // Importa Mapbox GL JS
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'; // Geocoder
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';*/


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

type funcionValidacion = (inmueble: Inmueble) => boolean | string;

// objeto de validaciones
const validaciones : Record<number, funcionValidacion> = {
    1 : ({ tipoInmueble }) : boolean | string => {
        return tipoInmueble !== '' ? true : 'Selecciona una opción para continuar';
    },

    2 : ({servicios, amenidades}) : boolean | string => {
        return servicios.length > 0 && amenidades.length > 0 ? true : 'Para continuar, selecciona como mínimo un servicio y una amenidad';
    },

    3 : () : boolean => {
        return true;
    },

    4 : ({ fotos }) : boolean | string => {
        return fotos.length >= 5 && fotos.length <= 8 ? true : 'Sube como mínimo 5 fotos para continuar';
    },

    5 : () : boolean => {
        return true;
    },

    6 : () : boolean => {
        return true;
    },

    7 : () : boolean => {
        return true;
    },

    8 : () : boolean => {
        return true;
    }
}

const Wizar = () => {
    const [actual, setActual] = useState(1);
    const { inmueble } = useFormulario();

    const siguiente = () => {
        const fnValidar = validaciones[actual];
        const salida = fnValidar(inmueble);

        if(salida === true){
            setActual((prev) => prev + 1);
        }else{
            toast.error(salida);
            <ToastContainer/>
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
                {actual === 6 && <Titulo/>}
                {actual === 7 && <Descripcion/>}
                {actual === 8 && <Confirmar/>}
            </div>
            <div className="w-[95%] mx-auto">
                <Progress size="sm" aria-label="Loading..." value={(actual / 8) * 100}/>
                <div className="flex justify-between my-10">
                    {
                        actual > 1 && <Boton contenido="Anterior" onClick={anterior} className={estiloBoton.style} />
                    }
                    
                    {
                        actual < 8 ? <Boton contenido="Siguiente" onClick={siguiente} className={estiloBoton.style}/> : (
                            <Boton contenido="Enviar" onClick={null} className={estiloBoton.style}/>
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

const tiposInmueble = [
    {icon:'/icon/house.svg', content:'Casa'},
    {icon:'/icon/room.svg', content:'Cuarto'},
    {icon:'/icon/building.svg', content:'Departamento'}
]

const TipoInmueble = () => {
    const { inmueble ,setInmueble, reiniciarValores } = useFormulario();

    const handleSelect = (tipo : string) => {
        
        if(inmueble.tipoInmueble !== ''){
            reiniciarValores();
        }

        setInmueble({tipoInmueble:tipo});
    }    

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
                    className={clsx(
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
                    className={clsx(
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
    const {inmueble} = useFormulario();

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

const ImageUploader = () => {
    const { inmueble, setInmueble } = useFormulario();

    const onDrop = (acceptedFiles: File[]) => {
        const prev = inmueble.fotos;
        console.log(prev);
        setInmueble({fotos : [...prev, ...acceptedFiles] });
    }

    const quitarImg = (imagen : File) => {
        const fotosActuales = inmueble.fotos;
        let fotosActualizadas = fotosActuales.filter(foto => {
            return foto !== imagen;
        });

        setInmueble({fotos : fotosActualizadas});
    }

    // integrando react-dropzone
    const {getRootProps, getInputProps, isDragActive, isDragAccept} = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 8,
    });

    //generar preview de las imágenes seleccionadas
    const renderPreviews = () => {
        return inmueble.fotos.map((imagen, index) => {
            const imagenURL = URL.createObjectURL(imagen);
            return(
                <div key={index} className="relative group w-[470px] h-[300px] m-2">
                    <Image
                        src={imagenURL}
                        alt={`preview de imagen ${index}`}
                        layout="fill"
                        objectFit="cover"
                    />
                    <div className="absolute left-0 right-0 bottom-4 opacity-0 group-hover:opacity-100 transition-all">
                        <div className="grid place-items-center">
                            <Boton
                                contenido="X"
                                className="w-[35px] h-[35px] rounded-full border border-solid border-white text-white hover:bg-gray-600"
                                onClick={() => {quitarImg(imagen)}}
                            />
                        </div>
                    </div>
                </div>
            );
        })
    }

    return(
        <div className="w-[85%] mx-auto">
            <div {...getRootProps()} className={`p-4 border-2 border-dashed ${isDragActive ? 'border-blue-400' : 'border-gray-400'} rounded-lg hover:cursor-pointer`}>                
                <input {...getInputProps()} />
                {isDragActive && isDragAccept ?
                    <p className="text-center">Suelta tus imágenes aquí...</p> : <p className="text-center">Arrastra y suelta imágenes aquí o haz click para seleccionar</p>
                }
                <p className="text-center text-zinc-300">Solo se permiten imágenes con extensión .png o .jpeg</p>
            </div>

            {/* mostrar los preview */}
            <div className="flex flex-wrap mt-4">
                {renderPreviews()}
            </div>
        </div>
    );
}

const Fotos = () => {
    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Agrega algunas fotos de tu inmueble a rentar</h2>
            <p className="text-xl mb-8">Para iniciar se necesitan como mínimo 5 fotografías. Más adelante podrás agregar más y realizar cambios</p>
            <ImageUploader/>
        </div>
    );
}
/*
const Mapa = () => {
    const mapRef = useRef<MapRef>(null);
    const geocoderContainerRef = useRef<HTMLDivElement>(null); // Referencia para el contenedor del geocodificador

    const [viewport, setViewport] = useState({
        longitude: -103.3274,
        latitude: 20.662,
        zoom: 11
    });

    const [marker, setMarker] = useState({lat : 20.662, lng: -103.3274});

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    useEffect(() => {
        if(mapRef.current && geocoderContainerRef.current){
            const geocoder = new MapboxGeocoder({
                accessToken: `${token}`,
                placeholder: 'Ingresa tu dirección',
                marker: true,
            });

            // agregar geocodificador al mapa
            geocoder.addTo(geocoderContainerRef.current);

            // Escuchar los eventos del geocodificador
            geocoder.on('result', (e) => {
                const {result} = e;
                setMarker({
                    lat: result.center[1],
                    lng: result.center[0],
                });
            });
        }

    }, [token]);

    return(
        <div className="w-[80%] mx-auto">
      {/* Contenedor de la barra de búsqueda }
      <div ref={geocoderContainerRef} className="mb-4" />

      {/* Mapa  }
      <div className="h-[400px] rounded-lg relative">
        <Map
          ref={mapRef}
          initialViewState={viewport}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={token}
          onMove={(evt) => setViewport(evt.viewState)}
        >
          <Marker latitude={marker.lat} longitude={marker.lng}>
            <img src="/marker-icon.png" alt="marker" />
          </Marker>
        </Map>
      </div>
    </div>
    );
}*/

/*
const MapaEstatico = () => {

    const Data = {
        longitude: -103.3274,
        latitude: 20.662,
        zoom: 11,
        width: 650,
        height: 500
    };

    /*const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${Data.longitude},${Data.latitude},${Data.zoom},0/${Data.width}x${Data.height}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

    return(
        <div className="relative w-[650px] h-[500px] mx-auto">
            <Image
                src={'/inmueble.jpg'}
                alt="Mapa de guadalajara"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                unoptimized
            />
        </div>
    );
}*/

const Mapa = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        if(!mapContainerRef.current) return;

        mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-103.3274, 20.662],
            zoom: 10
        });

        mapRef.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                placeholder: 'Ingresa tu dirección',
                marker: true,
                
            })
        );

        return () => mapRef.current?.remove();

    }, []);

    return(
        <div ref={mapContainerRef} className="h-[500px] w-[650px] rounded-lg mx-auto"/>
    );
}

const Ubicacion = () => {
    return(
        <div className="pb-8">
            <h2 className="text-center font-semibold text-3xl mb-10">Selecciona la ubicación del inmueble</h2>
            <p className="text-xl mb-8 text-center">Es necesario que indiques donde se ubica el inmueble para que los alumnos conozcan su ubicación</p>
            <Mapa/>
        </div>
    );
}

const Entrada = ({ nombre, tipo, descripcion, placeholder}
    : {nombre : string, tipo : string, descripcion : string, placeholder:string}) => {

    const { inmueble } = useFormulario();

    return(
        <div className="grid grid-cols-2 items-center">
            <div className="relative w-[90%] h-[300px] mx-auto">
                <Image
                    src={URL.createObjectURL(inmueble.fotos[0])}
                    alt="Imagen de casa en renta"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-1">{nombre}</h2>
                <p className="text-gray-600 mb-4">{descripcion}</p>
                { tipo === 'text' ? 
                    <input
                        className='p-1 rounded-md w-[500px] h-[250px] bg-gray-100 text-center text-lg'
                        type="text"
                        placeholder={placeholder}/> :
                    <textarea
                        className='p-1 rounded-md w-[500px] h-[250px] bg-gray-100 text-lg'
                        placeholder={placeholder}>
                    </textarea>
                }
            </div>
        </div>
    );
}

const Titulo = () => {
    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Establece un título a tu inmueble</h2>
            <Entrada nombre="Título" tipo="text" descripcion="Los títulos cortos funcionan mejor. No te preocupes, posteriormente podrás modificarlo." placeholder="Departamentos el foráneo"/>
        </div>
    );
}

const Descripcion = () => {
    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Agrega una descripción del inmueble</h2>
            <Entrada nombre="Descripción" tipo="textarea" descripcion="Una buena descripción permite que los alumnos conozcan brevemente tu inmueble" placeholder="Casa acogedora cerca de la universidad ubicada en un coto privado. Está cerca de la estación del metro, FORUM y Tlaquepaque."/>
        </div>
    );
}

function getIcon(inmueble:string){
    const iconos : Record<string, string> = {
        'Casa' : '/icon/house.svg',
        'Cuarto' : '/icon/room.svg',
        'Departamento' : '/icon/building.svg',
        'Limpieza' : '/icon/cleaning.png',
        'Gas' : '/icon/gas.png',
        'Luz' : '/icon/power.png',
        'TV cable' : '/icon/television.png',
        'Agua' : '/icon/water-tap.png',
        'Wifi' : '/icon/wifi.png',
        'Boiler' : '/icon/boiler.png',
        'Lavadora' : '/icon/washing-machine.png',
        'Estacionamiento' : '/icon/parking.png',
        'Cocina' : '/icon/kitchen.png',
        'Refrigerador' : '/icon/fridge.png',
        'Comedor' : '/icon/chair.png',
        'Patio' : '/icon/fence.png',
        'Sala de estar' : '/icon/sofa.png',
        'Área de lavado' : '/icon/area-lavado.png',
        'Aire acondicionado' : '/icon/ac.png'
    }

    return iconos[inmueble];
}

const Confirmar = () => {
    const {inmueble} = useFormulario();

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10"> Confirma los datos de tu inmueble</h2>
            <h3 className="font-semibold text-xl">Tipo de inmueble</h3>
            <ImageElement
                icon={getIcon(inmueble.tipoInmueble)}
                content={inmueble.tipoInmueble}
                width={ImageElementStyles.width}
                height={ImageElementStyles.height}
                style={ImageElementStyles.style}
            />

            <h3 className="font-semibold text-xl">Servicios y Amenidades</h3>
            <h4 className="text-lg">Servicios</h4>
            {
                inmueble.servicios.map((servicio, index) => {
                    const icono = getIcon(servicio);
                    return(
                        <ImageElement
                            key={index}
                            icon={icono}
                            content={servicio}
                            width={ImageElementStyles.width}
                            height={ImageElementStyles.height}
                            style={ImageElementStyles.style}
                        />
                    );
                })
            }
            
            <h4 className="text-lg">Amenidades</h4>
            {
                inmueble.amenidades.map((amenidad, index) => {
                    const icono = getIcon(amenidad);
                    return(
                        <ImageElement
                            key={index}
                            icon={icono}
                            content={amenidad}
                            width={ImageElementStyles.width}
                            height={ImageElementStyles.height}
                            style={ImageElementStyles.style}
                        />
                    );
                })
            }

            <h3 className="font-semibold text-xl">Información general del inmueble</h3>
            {/* Recamaras, camas, baños y huéspedes | pendiente de immplementar*/}
            <p>Recámaras: {inmueble.numRecamaras > 0 ? inmueble.numRecamaras : 'No aplica'}</p>
            <p>Camas: {inmueble.numCamas}</p>
            <p>Baños: {inmueble.numBanos > 0 ? inmueble.numBanos : 'No aplica'}</p>
            <p>Huéspedes: {inmueble.numHuespedes}</p>

            <h3 className="font-semibold text-xl">Fotografías del inmueble</h3>
            <div className="grid grid-cols-4 gap-4">
                {
                    inmueble.fotos.map((imagen, index)=> {
                        const url = URL.createObjectURL(imagen);
                        return(
                            <div key={index} className="relative w-[100%] h-[250px]">
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

            <h3 className="font-semibold text-xl">Ubicación</h3>
            <p>pendiente de implementar </p>

            <h3 className="font-semibold text-xl">Título</h3>

            <h3 className="font-semibold text-xl">Descripción</h3>
        </div>
    );
}

const Boton = ({contenido, onClick, className}:{contenido:string, onClick:any, className:string}) => {
    return(
        <button
            onClick={onClick}
            className={className}
        >
            {contenido}
        </button>
    );
}

// falta agregar el costo por mes del inmueble