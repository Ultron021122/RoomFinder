'use client';

import ImageTextEditor from "../GeneralComponents/ImageTextEditor";
import { useFormulario } from "./FormularioContext";
import { useMemo, useCallback } from "react";

export default function AddProperty() {
    const { inmueble, setInmueble } = useFormulario();

    // Usamos directamente las cadenas Base64 como imagenes
    const imagen = useMemo(() => inmueble.fotos[0], [inmueble.fotos]);
    const imagen2 = useMemo(() => inmueble.fotos[1], [inmueble.fotos]);

    const handlOnChange = useCallback((value: string) => {
        setInmueble({ titulo: value });
    }, []);

    const handleOnChangeDescription = useCallback((value: string) => {
        setInmueble({ descripcion: value });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Asegurarse de que el valor sea un número, o establecer un valor vacío o 0 si no lo es
        const precio = value ? parseFloat(value) : 0;

        // Solo actualizar si es un número válido (evita NaN)
        if (!isNaN(precio)) {
            setInmueble({ precio: precio });
        }
    };

    return (
        <section>
            <div className="mb-12 text-center">
                <h2 className="font-semibold text-center text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                    Propiedades del inmueble
                </h2>
                <p className="text-sm mb-8 text-neutral-800 dark:text-gray-400">
                    Por favor, llena los siguientes campos para publicar tu inmueble.
                </p>
            </div>
            <div className="p-4">
                <h2 className="font-semibold text-sm sm:text-lg md:text-xl text-neutral-900 dark:text-gray-100">
                    Precio por mes
                </h2>
                <p className="text-xs italic mb-2 text-neutral-800 dark:text-gray-400">
                    ¿Cuánto cuesta rentar tu inmueble por mes?
                </p>
                <div className="relative col-span-1 md:col-span-2 z-0 w-full mb-5 group">
                    <input
                        type="number"
                        name="precio"
                        id="precio"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                        value={inmueble.precio || ''}  // Mostrar vacío si el precio no está definido
                        onChange={handleChange}
                    />
                    <label
                        htmlFor="precio"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Precio
                    </label>
                </div>
            </div>
            <ImageTextEditor
                src={imagen}
                nombre="Título del inmueble"
                tipo="text"
                descripcion="Los títulos cortos funcionan mejor. No te preocupes, posteriormente podrás modificarlo."
                placeholder="Departamentos el foráneo"
                handleInput={handlOnChange}
                value={inmueble.titulo}
            />
            <ImageTextEditor
                src={imagen2}
                nombre="Descripción"
                tipo="textarea"
                descripcion="Una buena descripción permite que los alumnos conozcan brevemente tu inmueble"
                placeholder="Departamentos el foráneo es un lugar tranquilo y seguro para vivir. Cuenta con todos los servicios y está cerca de la universidad."
                handleInput={handleOnChangeDescription}
                value={inmueble.descripcion}
            />
        </section>
    );
}
