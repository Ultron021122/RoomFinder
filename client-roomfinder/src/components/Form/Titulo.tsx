'use client';

import ImageTextEditor from "../GeneralComponents/ImageTextEditor";
import { useFormulario } from "./FormularioContext";
import { useMemo, useCallback } from "react";

export default function AddProperty() {

    const { inmueble, setInmueble } = useFormulario();

    const imagen = useMemo(() => URL.createObjectURL(inmueble.fotos[0]), []);
    const imagen2 = useMemo(() => URL.createObjectURL(inmueble.fotos[1]), []);

    const handlOnChange = useCallback((value: string) => {
        setInmueble({ titulo: value });
    }, []);

    const handleOnChangeDescription = useCallback((value: string) => {
        setInmueble({ descripcion: value });
    }, []);

    return (
        <div>
            <h2 className="font-semibold text-center text-base sm:text-xl md:text-2xl mb-8 text-neutral-900 dark:text-gray-100">
                Agrega un título a tu inmueble
            </h2>
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
        </div>
    );
}