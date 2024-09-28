'use client';

import { useFormulario } from "./FormularioContext";
import ImageElement from "../GeneralComponents/ImageElement";
import clsx from 'clsx';

export const ImageElementStyles = {
    width: 40,
    height: 40,
    style:"flex gap-2 border border-gray-500 p-4 rounded-lg w-[250px] justify-center items-center hover:border-black hover:cursor-pointer"
}

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

export default function ServiciosAmenidades(){
    const { inmueble, setInmueble } = useFormulario();

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