'use client';

import { useFormulario } from "./FormularioContext";
import ImageElement from "../GeneralComponents/ImageElement";
import { ImageElementStyles } from "./ServiciosAmenidades";
import clsx from 'clsx';

const tiposInmueble = [
    {icon:'/icon/house.svg', content:'Casa'},
    {icon:'/icon/room.svg', content:'Cuarto'},
    {icon:'/icon/building.svg', content:'Departamento'}
]

export default function TipoInmueble() {
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
                    tiposInmueble.map((data, index) =>
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