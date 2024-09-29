'use client';

import React from 'react';
import Image from 'next/image';

const ImageTextEditor = React.memo(({ nombre, tipo, descripcion, placeholder, value, src, handleInput} : 
    {
        nombre : string,
        tipo : string,
        descripcion : string,
        placeholder:string,
        value:string,
        src: string,
        handleInput: (value : string) => void
    }) => {

    function handleChange(e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        handleInput(e.target.value);
    }

    return(
        <div className="grid grid-cols-2 items-center">
            <div className="relative w-[90%] h-[300px] mx-auto">
                <Image
                    src={src}
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
                        placeholder={placeholder}
                        onChange={handleChange}
                        value={value}
                    /> :
                    <textarea
                        className='p-1 rounded-md w-[500px] h-[250px] bg-gray-100 text-lg'
                        placeholder={placeholder}
                        onChange={handleChange}
                        value={value}
                    >
                    </textarea>
                }
            </div>
        </div>
    );
})

export default ImageTextEditor;