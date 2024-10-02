'use client';

import { useFormulario } from "./FormularioContext";
import { useMemo } from "react";
import Image from 'next/image';
import { getInput } from "./ConfirmarUbicacion";
import { FormControl, Input, InputAdornment, InputLabel } from "@mui/material";

export default function CostoMes() {

    const { inmueble, setInmueble } = useFormulario();

    const imagenes = useMemo(() => {
        return inmueble.fotos.map((foto, index) => {
            const url = URL.createObjectURL(foto);

            /* posicionamiento de la imágen principal */
            let colSpan = index === 0 ? 'col-span-2' : null;
            let rowSpan = index === 0 ? 'row-span-2' : null;
            let height = index === 0 ? 'h-full]' : 'h-[180px]';

            return index < 5 && (
                <div key={index} className={`relative w-full min-h-40 md:h-full ${height}  ${colSpan} ${rowSpan}`} >
                    <Image
                        width={800}
                        height={600}
                        src={url}
                        alt={`Imagen de inmueble`}
                        className='absolute inset-0 object-cover w-full h-full'
                    />
                </div>
            );
        });
    }, []);

    function handleInput(nombre: string, value: string | number) {
        const prop = getInput(nombre);
        setInmueble({ [prop]: value })
    }

    return (
        <div className="w-full mx-auto">
            <h2 className="font-semibold text-center text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                Para finalizar, establece el costo del inmueble por mes
            </h2>
            <div className="my-5">
                <p className=" text-xs sm:text-sm font-semibold text-neutral-800 dark:text-gray-300">
                    Título: <span className="font-normal text-xs sm:text-sm">{inmueble.titulo}</span>
                </p>
                <p className=" text-xs sm:text-sm font-semibold text-neutral-800 dark:text-gray-300">
                    Descripción: <span className="font-normal text-neutral-700 dark:text-gray-400  text-xs sm:text-sm">{inmueble.descripcion}</span>
                </p>
            </div>
            <FormControl
                sx={{
                    m: 1,
                    borderRadius: 1, // Bordes redondeados
                }}
                variant="standard"
            >
                <InputLabel
                    htmlFor="precio"
                    className=" font-semibold text-neutral-800 dark:text-gray-400"
                >
                    Costo por mes
                </InputLabel>
                <Input
                    id="precio"
                    type="number"
                    value={inmueble.precio}
                    onChange={(e) => {
                        handleInput('precio', e.target.value);
                    }}
                    startAdornment={
                        <InputAdornment position="start"
                            sx={{
                                color: '#a3a3a3',
                            }}
                        > {/* Color del ícono */}
                            $
                        </InputAdornment>
                    }
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: '1rem', // Tamaño del texto
                            color: '#a3a3a3', // Color del texto
                        },
                        '&:before': {
                            borderBottom: '2px solid #a3a3a3', // Color del borde antes de enfocar
                            content: '""',
                        },
                        '&:after': {
                            borderBottom: '2px solid #1976d2', // Color del borde al enfocar
                            content: '""',
                        },
                        '& .MuiInputBase-root': {
                            '&.Mui-focused:before': {
                                borderBottom: '2px solid #1976d2', // Color del borde al enfocar
                            },
                        },
                    }}
                />
            </FormControl>


            {/* contenedor de imagenes */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
                {imagenes}
            </div>
            <p className="text-sm mt-2 sm:text-base md:text-xl font-semibold text-neutral-800 dark:text-gray-300">Fotografías del inmueble</p>
            <p className="text-gray-600 mb-4 text-sm italic">No todas las fotografías están incluidas en este apartado. Posteriormente se mostrarán todas.</p>
        </div>
    );
}