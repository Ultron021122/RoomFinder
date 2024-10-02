'use client';

import React from 'react';
import Image from 'next/image';

const ImageTextEditor = React.memo(({ nombre, tipo, descripcion, placeholder, value, src, handleInput }:
    {
        nombre: string,
        tipo: string,
        descripcion: string,
        placeholder: string,
        value: string,
        src: string,
        handleInput: (value: string) => void
    }) => {

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        handleInput(e.target.value);
    }

    return (
        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-96 md:min-h-60">
            <div className="relative w-full min-h-40 md:h-full" >
                <Image
                    width={800}
                    height={600}
                    src={src}
                    alt={`Imagen de inmueble`}
                    className='absolute inset-0 object-cover w-full h-full'
                />
            </div>
            <div className='flex flex-col items-center justify-center mx-auto'>
                <div>
                    <h2 className="font-semibold text-sm sm:text-lg md:text-xl text-neutral-900 dark:text-gray-100">
                        {nombre}
                    </h2>
                    <p className="text-xs italic mb-8 text-neutral-800 dark:text-gray-400">
                        {descripcion}
                    </p>
                </div>
                {tipo === 'text' ?
                    (
                        <>
                            {/* Input */}
                            <div className="relative col-span-1 md:col-span-2 z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name={nombre}
                                    id={nombre}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=""
                                    autoComplete="off"
                                    value={value}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor={nombre}
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    {nombre}
                                </label>
                            </div>
                        </>
                    ) :
                    <textarea
                        className='p-1 text-gray-800 dark:text-gray-300 placeholder:italic bg-transparent text-xs rounded-md w-full h-20 shadow-sm border border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none'
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