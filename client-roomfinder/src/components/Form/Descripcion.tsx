'use client';

import ImageTextEditor from "../GeneralComponents/ImageTextEditor";
import { useFormulario } from "./FormularioContext";
import { useMemo, useCallback } from "react";

export default function Descripcion() {
    const {inmueble, setInmueble} = useFormulario();

    const imagen = useMemo(() => URL.createObjectURL(inmueble.fotos[1]), []);

    const handleOnChange = useCallback((value : string) => {
        setInmueble({descripcion : value});
    }, []);

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Agrega una descripción del inmueble</h2>
            <ImageTextEditor
                src={imagen}
                nombre="Descripción"
                tipo="textarea"
                descripcion="Una buena descripción permite que los alumnos conozcan brevemente tu inmueble"
                placeholder="Casa acogedora cerca de la universidad ubicada en un coto privado. Está cerca de la estación del metro, FORUM y Tlaquepaque."
                handleInput={handleOnChange}
                value={inmueble.descripcion}
            />
        </div>
    );
}