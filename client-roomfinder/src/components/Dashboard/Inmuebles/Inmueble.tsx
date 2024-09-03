'use client';

import Image from "next/image";
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import clsx from 'clsx';

interface Imagen{
    url:string,
    id:number
}

interface Inmueble{
    imagenes:Imagen[],
    tipo:string,
    dormitorios: number,
    banos: number,
    ocupantes: number,
    costo: number,
    descripcion:string
}

export default function Inmueble({inmueble}:{inmueble:Inmueble}){

    console.log("hola desde el padre!")

    const listaImagenes = inmueble.imagenes.map((imagen, index) =>
        <div key={index} className="relative min-w-full h-full" >
            <Image
                src={imagen.url}
                alt={`Imagen de inmueble ${imagen.id}`}
                layout="fill"
                objectFit="cover"
            />
        </div>
    );

    return(
        <div className="flex flex-col">
            <Galeria imagenes={listaImagenes}/>
            <div className="bg-gray-200 p-4 border border-[#c8c8c8] text-lg rounded-b-xl">
                <p className="mb-2">Tipo de Inmueble: {inmueble.tipo}</p>
                <p className="mb-2"><span className="font-semibold text-xl">{`$${inmueble.costo} MXN `}</span>por mes</p>
                <p className="mb-4">{inmueble.descripcion}</p> 
                <p className="py-4 text-center bg-amber-400 text-white font-semibold w-[50%] rounded-lg transition-colors hover:bg-amber-500 cursor-pointer"> Ver propiedad</p>
            </div>
        </div>
    );
}

function Galeria({imagenes}: {imagenes:any[]}){
    const [actual, setActual] = useState(0);
    
    console.log(actual);

    const prev = () => setActual((actual) => (actual === 0 ? imagenes.length - 1 : actual - 1))
    const next = () => setActual((actual) => (actual === imagenes.length - 1 ? 0 : actual + 1))

    const indicadores = imagenes.map((imagen, index) => 
        <div className={clsx(
            "bg-white w-[8px] h-[8px] rounded-full transition-all",
            {
                "w-[12px] h-[12px] bg-opacity-80" : actual === index,
            },
        )}>
        </div>
    );

    return(
        <div className="relative group overflow-hidden h-[260px] rounded-t-xl">
            <div className="flex h-full w-full transition-transform ease-out duration-500 transform bg-slate-400" style={{transform:`translateX(-${actual * 100}%)`}}>
                {imagenes}
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={prev} className="p-1 rounded-full bg-white opacity-80 hover:opacity-100 transition-opacity duration-400">
                    <ChevronLeft size={25}/>
                </button>
                <button onClick={next} className="p-1 rounded-full bg-white opacity-80 hover:opacity-100 transition-opacity duration-400">
                    <ChevronRight size={25}/>
                </button>
            </div>

            {/* indicadores */}
            <div className="absolute right-0 left-0 bottom-3 opacity-0 group-hover:opacity-100 transition-all">
                <div className="flex items-center justify-center gap-2">
                    {indicadores}
                </div>
            </div>
        </div>
    );
}