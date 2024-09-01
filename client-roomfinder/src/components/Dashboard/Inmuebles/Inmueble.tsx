import Image from "next/image";
import Icon from "./icon";

interface inmueble{
    imagen:string,
    dormitorios: number,
    banos: number,
    ocupantes: number,
    costo: number,
    descripcion:string
}

export default function Inmueble({inmueble}:{inmueble:inmueble}){
    return(
        <div className="flex flex-col">
            <Image
                src={inmueble.imagen}
                alt="Imagen de inmueble"
                width={200}
                height={100}
                layout="responsive"
            />
            <div className="bg-gray-200 p-4 border border-[#c8c8c8]">
                <p className="font-semibold text-center text-2xl italic mb-4">{`$${inmueble.costo}`}</p>
                <p className="mb-4">{inmueble.descripcion}</p>
                <div className="flex justify-evenly mb-4">
                    <Icon src={'/icon/icono_dormitorio.svg'} cantidad={inmueble.dormitorios}/>
                    <Icon src={'/icon/icono_wc.svg'} cantidad={inmueble.banos}/>
                    <Icon src={'/icon/user.svg'} cantidad={inmueble.ocupantes}/>
                </div>
                <p className="py-4 text-center bg-amber-500 text-white font-semibold"> Actualizar propiedad</p>
            </div>
        </div>
    );
}