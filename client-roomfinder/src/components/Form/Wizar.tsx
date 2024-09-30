'use client';

import { toast, Bounce, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button, Progress } from "@nextui-org/react";
import { useFormulario, Inmueble } from "./FormularioContext";
import { useState } from "react";
import TipoInmueble from "./TipoInmueble";
import ServiciosAmenidades from "./ServiciosAmenidades";
import InformacionGeneral from "./InformacionGeneral";
import Fotos from "./Fotos";
import Ubicacion from "./Ubicacion";
import ConfirmarUbicacion from "./ConfirmarUbicacion";
import Titulo from "./Titulo";
import Descripcion from "./Descripcion";
import Restricciones from "./Restricciones";
import CostoMes from "./CostoMes";
import Confirmar from "./Confirmar";

/* Mejora de perfomance */
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const esNumero = (valor?: string): boolean => valor !== undefined && /^[0-9]+$/.test(valor);
export const inputVacio = (input?: string): boolean => !input;

export const NUM_MIN_RESTRICCIONES = 4;

type FuncionValidacion = (inmueble: Inmueble) => boolean | string;

const validaciones: Record<number, FuncionValidacion> = {
    1: ({ tipoInmueble }) => tipoInmueble ? true : 'Selecciona una opción para continuar',
    2: ({ servicios, amenidades }) => (servicios.length && amenidades.length) ? true : 'Selecciona un servicio y una amenidad',
    3: ({ tipoInmueble, numRecamaras, numCamas, numBanos, numHuespedes, capEstacionamiento, amenidades }) => {
        const esValido = {
            'Casa': numRecamaras > 0 && numCamas > 0 && numBanos > 0 && numHuespedes > 0,
            'Habitación': numHuespedes > 0 && numCamas > 0,
            'Departamento': numRecamaras > 0 && numCamas > 0 && numBanos > 0 && numHuespedes > 0,
        }[tipoInmueble] || false;

        if (amenidades.includes('Estacionamiento') && esValido && capEstacionamiento <= 0) {
            return 'Falta establecer la capacidad del estacionamiento';
        }
        return esValido ? true : 'Llene todos los campos para continuar';
    },
    4: ({ fotos }) => (fotos.length >= 5 && fotos.length <= 8) ? true : 'Sube de 5 a 8 fotos para continuar',
    5: ({ ubicacion }) => {
        const { pais, direccion, estado, codigoPostal, ciudad_municipio, latitud, longitud } = ubicacion;
        return (pais && direccion && estado && codigoPostal !== -1 && ciudad_municipio && latitud && longitud) ? true : 'Ingresa la dirección de tu inmueble para continuar';
    },
    6: ({ ubicacion: { numExt, numInt } }) => {
        console.log(numExt, numInt);
        if (inputVacio(numExt)) return 'El número exterior es obligatorio';
        if (!esNumero(numExt)) return 'El número exterior ingresado no es válido';
        if (!inputVacio(numInt) && !esNumero(numInt)) return 'El número interior ingresado no es válido';
        return true;
    },
    7: ({ titulo }) => (titulo.length >= 10) ? true : 'Ingrese un título de propiedad válido',
    8: ({ descripcion }) => (descripcion.length >= 20) ? true : 'La descripción debe contener como mínimo 20 caracteres',
    9: ({ reglas }) => {
        if (reglas.length < NUM_MIN_RESTRICCIONES) {
            return `Es indispensable que agregues como mínimo ${NUM_MIN_RESTRICCIONES} restricciones`;
        }
        return reglas.every(regla => regla.length >= 8) ? true : 'Las reglas deben contener información válida';
    },
    10: ({ costo }) => (esNumero(costo.toString()) && costo > 0) ? true : 'El valor ingresado no es válido',
    11: () => true,
};

export default function Wizar() {
    const [actual, setActual] = useState<number>(1);
    const { inmueble } = useFormulario();

    const siguiente = () => {
        const fnValidar = validaciones[actual];
        const salida = fnValidar(inmueble);
        if (salida === true) {
            setActual(prev => prev + 1);
        } else {
            toast.error(salida, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
                style: { fontSize: '0.9rem' },
                transition: Bounce,
            });
        }
    };

    const handleClick = () => {
        if (actual < 11) {
            siguiente();
        }
    };

    const anterior = () => setActual(prev => prev - 1);

    return (
        <div className="w-full">
            <PerfectScrollbar>
                <div className="h-[100vh]">
                    <div className="w-full sm:w-3/4 mt-8 mx-auto h-auto overflow-hidden overflow-y-auto">
                        {actual === 1 && <TipoInmueble />}
                        {actual === 2 && <ServiciosAmenidades />}
                        {actual === 3 && <InformacionGeneral />}
                        {actual === 4 && <Fotos />}
                        {actual === 5 && <Ubicacion />}
                        {actual === 6 && <ConfirmarUbicacion />}
                        {actual === 7 && <Titulo />}
                        {actual === 8 && <Descripcion />}
                        {actual === 9 && <Restricciones />}
                        {actual === 10 && <CostoMes />}
                        {actual === 11 && <Confirmar />}
                    </div>
                    <div className="w-full sm:w-3/4 mx-auto pt-5 pb-10">
                        <Progress
                            size="sm"
                            aria-label="Loading..."
                            classNames={{
                                label: "font-medium text-default-700 dark:text-gray-200",
                                value: "text-gray-700 dark:text-gray-200",
                            }}
                            value={(actual / 11) * 100}
                            label={`Paso ${actual} de 11`}
                            showValueLabel={true}
                        />
                        <div className="flex justify-between mt-5 mb-10">
                            <Button
                                onClick={anterior}
                                style={{
                                    backgroundColor: actual === 1 ? '#64748b' : '#1e293b',
                                    color: actual === 1 ? '#fff' : '#fff',
                                }}
                                disabled={actual === 1}
                            >
                                Anterior
                            </Button>
                            <Button
                                color="primary"
                                onClick={handleClick}
                            >
                                {actual < 11 ? "Siguiente" : "Enviar"}
                            </Button>
                        </div>
                    </div>
                </div>
            </PerfectScrollbar >
        </div >
    );
}
