'use client';

import { useFormulario } from "./FormularioContext";
import Input from "../GeneralComponents/Input";


export function getInput(tipoInput : string) : string{

    const inputs : Record<string, string> = {
        'Número exterior' : 'numExt',
        'Número interior' : 'numInt',
        'Costo' : 'costo'
    };

    return inputs[tipoInput];
}

export default function ConfirmarUbicacion() {
    const {inmueble, setInmueble} = useFormulario();
    let {
        pais,
        direccion,
        estado,
        codigoPostal,
        ciudad_municipio,
        numExt,
        numInt
    } = inmueble.ubicacion;

    // fijar los datos directamente en el contexto
    function handleInput(name: string, value : number | string){ 

        const prop = getInput(name);

        setInmueble({
            ubicacion: {
                ...inmueble.ubicacion,
                [prop]: value
            }
        });
    }

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Confirma la ubicación de tu inmueble</h2>
            <div className="grid grid-cols-2 gap-4 w-[85%] mx-auto px-8 py-4">
                <Input type="text" nombre="País" value={pais} placeholder="ingrese algo. . ." disabled={true}/>
                <Input type="text" nombre="Dirección" value={direccion} placeholder="ingrese algo. . ." disabled={true}/>
                <Input type="text" nombre="Estado" value={estado} placeholder="ingrese algo. . ." disabled={false}/>
                <Input type="number" nombre="Código postal" value={codigoPostal} placeholder="ingrese algo. . ." disabled={true}/>
                <Input type="text" nombre="Ciudad / municipio" value={ciudad_municipio} placeholder="ingrese algo. . ." disabled={true}/>
                <Input type="text" nombre="Número exterior" value={numExt} placeholder="Número exterior (obligatorio)" disabled={false} handleInput={handleInput}/>
                <Input type="text" nombre="Número interior" value={numInt} placeholder="Número interior (opcional)" disabled={false} handleInput={handleInput}/>
            </div>
        </div>
    );
}