'use client';

import PropertyModifier from "../GeneralComponents/PropertyModifier";
import { useFormulario } from "./FormularioContext";

const Casa = {
    recamaras: { min: 1, max: 15 },
    camas: { min: 1, max: 20 },
    banos: { min: 1, max: 18 },
    huespedes: { min: 1, max: 30 }
}

const Habitacion = {
    huespedes: { min: 1, max: 4 },
    camas: { min: 1, max: 4 }
}

const Departamento = {
    recamaras: { min: 1, max: 4 },
    camas: { min: 1, max: 4 },
    banos: { min: 1, max: 3 },
    huespedes: { min: 1, max: 6 }
}

const Estacionamiento = {
    min: 1,
    max: 5
}


export default function InformacionGeneral() {
    const { inmueble } = useFormulario();

    return (
        <div>
            <div className='mb-12 text-center'>
                <h2 className="font-semibold text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                    Información general
                </h2>
                <p className="text-sm mb-8 text-neutral-800 dark:text-gray-400">
                    Selecciona la cantidad de recámaras, camas, baños y huéspedes
                </p>
            </div>
            <div className="flex flex-col gap-4">
                {inmueble.tipoInmueble === 'Casa' && (
                    <div className="space-y-3 md:space-y-4">
                        <PropertyModifier content="Recámaras" min={Casa.recamaras.min} max={Casa.recamaras.max} />
                        <PropertyModifier content="Camas" min={Casa.camas.min} max={Casa.camas.max} />
                        <PropertyModifier content="Baños" min={Casa.banos.min} max={Casa.banos.max} />
                        <PropertyModifier content="Huéspedes (capacidad)" min={Casa.huespedes.min} max={Casa.huespedes.max} />
                    </div>
                )}

                {inmueble.tipoInmueble === 'Habitación' && (
                    <div>
                        <PropertyModifier content="Huéspedes (capacidad)" min={Habitacion.huespedes.min} max={Habitacion.huespedes.max} />
                        <PropertyModifier content="Camas" min={Habitacion.camas.min} max={Habitacion.camas.max} />
                    </div>
                )}

                {inmueble.tipoInmueble === 'Departamento' && (
                    <div>
                        <PropertyModifier content="Recámaras" min={Departamento.recamaras.min} max={Departamento.recamaras.max} />
                        <PropertyModifier content="Camas" min={Departamento.camas.min} max={Departamento.camas.max} />
                        <PropertyModifier content="Baños" min={Departamento.banos.min} max={Departamento.banos.max} />
                        <PropertyModifier content="Huéspedes (capacidad)" min={Departamento.huespedes.min} max={Departamento.huespedes.max} />
                    </div>
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