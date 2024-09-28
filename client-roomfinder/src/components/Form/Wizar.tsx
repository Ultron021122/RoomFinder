'use client';

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Progress } from "@nextui-org/react";
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
import Button from "../GeneralComponents/Button";

function esNumero(valor : string | undefined) : boolean{
    if(valor == undefined){
        return false
    }
    return /^[0-9]+$/.test(valor);
}

export function inputVacio(input : string | undefined) : boolean{
    if(input == undefined || input == '') return true;

    return false;
}

export const NUM_MIN_RESTRICCIONES = 4;

type funcionValidacion = (inmueble: Inmueble) => boolean | string;

// objeto de validaciones
const validaciones : Record<number, funcionValidacion> = {
    1 : ({ tipoInmueble }) : boolean | string => {
        return tipoInmueble !== '' ? true : 'Selecciona una opción para continuar';
    },

    2 : ({servicios, amenidades}) : boolean | string => {
        return servicios.length > 0 && amenidades.length > 0 ? true : 'Para continuar, selecciona como mínimo un servicio y una amenidad';
    },

    3 : (inmueble : Inmueble) : boolean | string => {
        const {
            tipoInmueble,
            numRecamaras,
            numCamas,
            numBanos,
            numHuespedes,
            capEstacionamiento,
            amenidades
        } = inmueble;
        let salida : boolean | string = 'Llene todos los campos para continuar';

        switch(tipoInmueble){
            case 'Casa':
                if(numRecamaras > 0 && numCamas > 0 && numBanos > 0 && numHuespedes > 0){
                   salida = true;
                }
            break;

            case 'Cuarto':
                if(numHuespedes > 0 && numCamas > 0){
                    salida = true;
                }
            break;

            case 'Departamento':
                if(numRecamaras > 0 && numCamas > 0 && numBanos > 0 && numHuespedes > 0){
                    salida = true;
                }
            break;

            default:
            break;
        }

        if(amenidades.includes('Estacionamiento') && salida == true){
            if(capEstacionamiento > 0){
                salida = true;
            }else{
                salida = 'Falta establecer la capacidad del estacionamiento';
            }
        }

        return salida;
    },

    4 : ({ fotos }) : boolean | string => {
        return fotos.length >= 5 && fotos.length <= 8 ? true : 'Sube como mínimo 5 fotografías para continuar, como máximo 8';
    },

    5 : ({ubicacion}) : boolean | string => {
        return true;
        const {
            pais,
            direccion,
            estado,
            codigoPostal,
            ciudad_municipio
        } = ubicacion;

        if(pais == '' || direccion == '' || estado == '' || codigoPostal == -1 || ciudad_municipio == ''){
            return 'Ingresa la dirección de tu inmueble para continuar';
        }

        return true;
    },

    6 : ({ubicacion}) : boolean | string => {

        const {numExt, numInt} = ubicacion;
        let salida : boolean | string = 'El número exterior es obligatorio';

        if(!inputVacio(numExt)){
            if(esNumero(numExt)){
                salida = true;
            }else{
                salida = 'El número exterior ingresado no es válido';
            }

            if(salida == true && !inputVacio(numInt)){
                if(esNumero(numInt)){
                    salida = true;
                }else{
                    salida = 'El número interior ingresado no es válido';
                }
            }
        }

        return salida;
    },

    7 : ({titulo}) : boolean | string => {
        return titulo.length >= 10 ? true : 'Ingrese un título de propiedad válido';
    },

    8 : ({descripcion}) : boolean | string => {
        return descripcion.length >= 20 ? true : 'La descripción debe contener como mínimo 20 caracteres';
    },

    9 : ({reglas}) : boolean | string => {
        
        if(reglas.length >= NUM_MIN_RESTRICCIONES){
            
            let salida : boolean | string = true;

            reglas.forEach((regla) => {
                if(regla.length < 8){
                    salida = 'Las reglas deben contener información válida';
                    return;
                }
            });

            return salida;

        }else{
            return `Es indispensable que agregues como mínimo ${NUM_MIN_RESTRICCIONES} restricciones`;
        }
    },

    10 : ({costo}) : boolean | string => {
        if(esNumero(costo.toString()) && costo > 0){
            return true
        }
        return 'El valor ingresado no es válido';
    },

    11: () : boolean | string => {
        return true;
    }
}

export default function Wizar() {
    const [actual, setActual] = useState(1);
    const { inmueble } = useFormulario();

    const siguiente = () => {
        const fnValidar = validaciones[actual];
        const salida = fnValidar(inmueble);

        if(salida === true){
            setActual((prev) => prev + 1);
        }else{
            toast.error(salida);
            <ToastContainer/>
        }
    }

    const anterior = () => {
        setActual((prev) => prev - 1);
    }

    const estiloBoton = {
        style:"text-center bg-[#007aff] p-4 rounded-lg w-[150px] text-white font-semibold text-lg hover:bg-opacity-90"
    }

    return(
        <div>
            <div className="w-[95%] mx-auto mt-10 h-[500px] overflow-hidden overflow-y-auto">
                {actual === 1 && <TipoInmueble/>} 
                {actual === 2 && <ServiciosAmenidades/>}
                {actual === 3 && <InformacionGeneral/>}
                {actual === 4 && <Fotos/>}
                {actual === 5 && <Ubicacion/>}
                {actual === 6 && <ConfirmarUbicacion/>}
                {actual === 7 && <Titulo/>}
                {actual === 8 && <Descripcion/>}
                {actual === 9 && <Restricciones/>}
                {actual === 10 && <CostoMes/>}
                {actual === 11 && <Confirmar/>}
            </div>
            <div className="w-[95%] mx-auto">
                <Progress size="sm" aria-label="Loading..." value={(actual / 11) * 100}/>
                <div className="flex justify-between my-10">
                    {
                        actual > 1 && <Button contenido="Anterior" onClick={anterior} className={estiloBoton.style} />
                    }
                    
                    {
                        actual < 11 ? <Button contenido="Siguiente" onClick={siguiente} className={estiloBoton.style}/> : (
                            <Button contenido="Enviar" onClick={null} className={estiloBoton.style}/>
                        )
                    }
                </div>
            </div>
        </div>
    );
}