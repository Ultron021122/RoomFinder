'use client';

import { toast, Bounce, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Progress, Spinner } from "@nextui-org/react";
import { useFormulario, Inmueble } from "./FormularioContext";
import { useEffect, useState } from "react";
import TipoInmueble from "./TipoInmueble";
import ServiciosAmenidades from "./ServiciosAmenidades";
import InformacionGeneral from "./InformacionGeneral";
import Fotos from "./Fotos";
import Ubicacion from "./Ubicacion";
import ConfirmarUbicacion from "./ConfirmarUbicacion";
import Restricciones from "./Restricciones";
import Confirmar from "./Confirmar";

/* Mejora de perfomance */
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AddProperty from "./Titulo";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/utils/interfaces";
import { Button } from "../ui/button";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const esNumero = (valor?: string): boolean => valor !== undefined && /^[0-9]+$/.test(valor);
export const inputVacio = (input?: string): boolean => !input;

const validacionGeneral = (campo: any, mensaje: string): boolean | string => {
    return inputVacio(campo) ? mensaje : true;
};

const validacionNumero = (campo: any, mensaje: string): boolean | string => {
    return esNumero(campo) ? true : mensaje;
};


export const NUM_MIN_RESTRICCIONES = 4;

type FuncionValidacion = (inmueble: Inmueble) => boolean | string;

const validaciones: Record<number, FuncionValidacion> = {
    1: ({ tipoInmueble }) => validacionGeneral(tipoInmueble, 'Selecciona una opción para continuar'),
    // 2: ({ servicios }) => (servicios) ? true : 'Selecciona al menos un servicio',
    2: ({ fotos }) => (fotos.length >= 5 && fotos.length <= 8) ? true : 'Sube entre 5 y 8 fotos',
    3: ({ titulo, descripcion, precio }) => {
        if (titulo.length <= 10) return 'El título es muy corto';
        if (descripcion.length <= 20) return 'La descripción es muy corta';
        if (precio <= 0) return 'El precio debe ser mayor que 0';
        return true;
    },
    4: ({ servicios }) => {
        const serviciosActivos = Object.values(servicios).filter(value => value === true).length;
        return serviciosActivos > 0 ? true : 'Selecciona al menos un servicio o amenidad';
    },
    5: ({ tipoInmueble, numRecamaras, numCamas, numBanos, numHuespedes, capEstacionamiento, servicios }) => {
        const esValido = {
            1: numRecamaras > 0 && numCamas > 0 && numBanos > 0 && numHuespedes > 0,
            2: numHuespedes > 0 && numCamas > 0,
            3: numRecamaras > 0 && numCamas > 0 && numBanos > 0 && numHuespedes > 0,
        }[tipoInmueble] || false;

        if (servicios?.bnParkingIncluded && esValido && capEstacionamiento <= 0) {
            return 'Falta establecer la capacidad del estacionamiento';
        }

        return esValido ? true : 'Llene todos los campos para continuar';
    },
    6: ({ ubicacion }) => {
        const { pais, direccion, estado, codigoPostal, ciudad_municipio, latitud, longitud } = ubicacion;
        return (pais && direccion && estado && codigoPostal !== -1 && ciudad_municipio && latitud && longitud)
            ? true
            : 'Ingresa la dirección de tu inmueble';
    },

    7: ({ ubicacion: { numExt, numInt } }) => {
        const validNumExt = validacionGeneral(numExt, 'El número exterior es obligatorio');
        if (validNumExt !== true) return validNumExt;

        const validNumExtValido = validacionNumero(numExt, 'El número exterior no es válido');
        if (validNumExtValido !== true) return validNumExtValido;

        if (numInt && !esNumero(numInt)) return 'El número interior ingresado no es válido';
        return true;
    },
    8: ({ reglas }) => {
        if (reglas.length < NUM_MIN_RESTRICCIONES) {
            return `Agrega al menos ${NUM_MIN_RESTRICCIONES} restricciones`;
        }
        return reglas.every(regla => regla.length >= 8) ? true : 'Las reglas deben ser más detalladas';
    },

    9: () => true, // Confirmación final
};


export default function Wizar() {
    const [actual, setActual] = useState<number>(1);
    const { inmueble, setInmueble } = useFormulario();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user as UserProfile;

    const siguiente = () => {
        const fnValidar = validaciones[actual];
        const salida = fnValidar(inmueble);
        if (salida === true) {
            setActual(prev => prev + 1);
        } else {
            toast.error(salida, {
                position: "bottom-right",
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

    // Errores
    useEffect(() => {
        if (errorSystem) {
            toast.error(errorSystem, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    }, [errorSystem]);

    const handleClick = async () => {
        setInmueble({ lessorId: user.usuarioid, ...inmueble });
        if (actual < 9) return siguiente();
        console.log('Inmueble a enviar:', inmueble);
        // Enviar formulario
        const submit = async () => {
            setIsLoading(true);
            setErrorSystem(null);
            // Intentar enviar la información
            try {
                const response = await axios.post('/api/properties', inmueble);
                setIsLoading(false);
                if (response.status === 201) {
                    toast.success(response.data.message.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                        style: { fontSize: '0.9rem' },
                        transition: Slide,
                    });
                    router.push('/dashboard/properties');
                } else {
                    setErrorSystem(response.data.message);
                }
            } catch (Error: any) {
                setErrorSystem(Error.response.data.message);
            } finally {
                setIsLoading(false);
            }
        };
        await submit();
    };

    const anterior = () => setActual(prev => prev - 1);

    return (
        <div className="w-full">
            <PerfectScrollbar>
                <div className="bg-gradient-to-r p-2 md:p-8">
                    <Card className="overflow-hidden w-full max-w-8xl mx-auto bg-gray-100 dark:bg-gray-950">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Publicar propiedad</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                isLoading ? (
                                    <div className="flex items-center justify-center h-96">
                                        <Spinner color="primary" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-full md:w-3/4 px-3 md:px-0 mt-8 mx-auto h-auto overflow-hidden overflow-y-auto">
                                            {actual === 1 && <TipoInmueble />}
                                            {actual === 2 && <Fotos />}
                                            {actual === 3 && <AddProperty />}
                                            {actual === 4 && <ServiciosAmenidades />}
                                            {actual === 5 && <InformacionGeneral />}
                                            {actual === 6 && <Ubicacion />}
                                            {actual === 7 && <ConfirmarUbicacion />}
                                            {actual === 8 && <Restricciones />}
                                            {actual === 9 && <Confirmar />}
                                        </div>
                                        <div className="w-full md:w-3/4 px-3 md:px-0 mx-auto pt-5 pb-10">
                                            <Progress
                                                size="sm"
                                                aria-label="Loading..."
                                                classNames={{
                                                    label: "font-medium text-default-700 dark:text-gray-200",
                                                    value: "text-gray-700 dark:text-gray-200",
                                                }}
                                                value={(actual / 9) * 100}
                                                label={`Paso ${actual} de 9`}
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
                                                    color={actual < 9 ? 'primary' : 'success'}
                                                    onClick={handleClick}
                                                >
                                                    {actual < 9 ? "Siguiente" : "Enviar"}
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                        </CardContent>
                    </Card>
                </div>
            </PerfectScrollbar >
        </div >
    );
}
