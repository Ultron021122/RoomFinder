'use client';

import ImageTextEditor from "../GeneralComponents/ImageTextEditor";
import { useFormulario } from "./FormularioContext";
import { useMemo, useCallback } from "react";

export default function Titulo() {

    const {inmueble, setInmueble} = useFormulario();

    const imagen = useMemo(() => URL.createObjectURL(inmueble.fotos[0]), []);

    const handlOnChange = useCallback((value : string) => {
        setInmueble({titulo : value});
    }, []);

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Establece un título a tu inmueble</h2>
            <ImageTextEditor
                src={imagen}
                nombre="Título"
                tipo="text"
                descripcion="Los títulos cortos funcionan mejor. No te preocupes, posteriormente podrás modificarlo."
                placeholder="Departamentos el foráneo"
                handleInput={handlOnChange}
                value={inmueble.titulo}
            />
        </div>
    );
}