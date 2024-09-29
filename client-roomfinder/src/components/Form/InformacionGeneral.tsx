'use client';

import PropertyModifier from "../GeneralComponents/PropertyModifier";
import { useFormulario } from "./FormularioContext";

const Casa = {
    recamaras: {min: 1, max: 15},
    camas: {min: 1, max: 20},
    banos: {min: 1, max: 18},
    huespedes: {min: 1, max: 30}
}

const Cuarto = {
    huespedes : {min: 1, max : 4},
    camas: {min:1, max: 4}
}

const Departamento = {
    recamaras: {min: 1, max : 4},
    camas: {min: 1, max: 4},
    banos: {min: 1, max: 3},
    huespedes: {min: 1, max: 6}
}

const Estacionamiento = {
    min: 1,
    max: 5
}


export default function InformacionGeneral() {
    const {inmueble} = useFormulario();

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Información general del inmueble</h2>
            <div className="flex flex-col gap-4">
                {inmueble.tipoInmueble === 'Casa' && (
                    <>
                        <PropertyModifier content="Recámaras" min={Casa.recamaras.min} max={Casa.recamaras.max}/>
                        <PropertyModifier content="Camas" min={Casa.camas.min} max={Casa.camas.max}/>
                        <PropertyModifier content="Baños" min={Casa.banos.min} max={Casa.banos.max}/>
                        <PropertyModifier content="Huéspedes (capacidad)" min={Casa.huespedes.min} max={Casa.huespedes.max}/>
                    </>
                )}

                {inmueble.tipoInmueble === 'Cuarto' && (
                    <>
                        <PropertyModifier content="Huéspedes (capacidad)" min={Cuarto.huespedes.min} max={Cuarto.huespedes.max}/>
                        <PropertyModifier content="Camas" min={Cuarto.camas.min} max={Cuarto.camas.max}/>
                    </>
                )}

                {inmueble.tipoInmueble === 'Departamento' && (
                    <>
                        <PropertyModifier content="Recámaras" min={Departamento.recamaras.min} max={Departamento.recamaras.max}/>
                        <PropertyModifier content="Camas" min={Departamento.camas.min} max={Departamento.camas.max}/>
                        <PropertyModifier content="Baños" min={Departamento.banos.min} max={Departamento.banos.max}/>
                        <PropertyModifier content="Huéspedes (capacidad)" min={Departamento.huespedes.min} max={Departamento.huespedes.max}/>
                    </>
                )}

                {
                    inmueble.amenidades.includes('Estacionamiento') && 
                    <PropertyModifier
                        content="Capacidad del estacionamiento"
                        min={Estacionamiento.min}
                        max={Estacionamiento.max}
                    />
                }
            </div>
        </div>
    );
}