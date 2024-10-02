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
import Restricciones from "./Restricciones";
import CostoMes from "./CostoMes";
import Confirmar from "./Confirmar";

/* Mejora de perfomance */
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AddProperty from "./Titulo";

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
        if (inputVacio(numExt)) return 'El número exterior es obligatorio';
        if (!esNumero(numExt)) return 'El número exterior ingresado no es válido';
        if (!inputVacio(numInt) && !esNumero(numInt)) return 'El número interior ingresado no es válido';
        return true;
    },
    7: ({ titulo, descripcion }) => {
        if (titulo.length <= 10) return 'El título es muy corto';
        if (descripcion.length <= 20) return 'La descripción es muy corta';
        return true;
    },
    8: ({ reglas }) => {
        if (reglas.length < NUM_MIN_RESTRICCIONES) {
            return `Es indispensable que agregues como mínimo ${NUM_MIN_RESTRICCIONES} restricciones`;
        }
        return reglas.every(regla => regla.length >= 8) ? true : 'Las reglas deben contener información válida';
    },
    9: ({ precio }) => {
        if (precio < 0 || precio == undefined) return 'El precio tiene que ser mayor a 0';
        if (esNumero(precio.toString()) != true) return 'El valor ingresado no es válido';
        return true;
    },
    10: () => true,
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
        if (actual < 10) {
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
                        {actual === 7 && <AddProperty />}
                        {actual === 8 && <Restricciones />}
                        {actual === 9 && <CostoMes />}
                        {actual === 10 && <Confirmar />}
                    </div>
                    <div className="w-full sm:w-3/4 mx-auto pt-5 pb-10">
                        <Progress
                            size="sm"
                            aria-label="Loading..."
                            classNames={{
                                label: "font-medium text-default-700 dark:text-gray-200",
                                value: "text-gray-700 dark:text-gray-200",
                            }}
                            value={(actual / 10) * 100}
                            label={`Paso ${actual} de 10`}
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
                                color={actual < 10 ? 'primary' : 'success'}
                                onClick={handleClick}
                            >
                                {actual < 10 ? "Siguiente" : "Enviar"}
                            </Button>
                        </div>
                    </div>
                </div>
            </PerfectScrollbar >
        </div >
    );
}
