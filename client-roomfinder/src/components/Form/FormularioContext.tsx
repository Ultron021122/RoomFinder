import React, { createContext, useContext, useState } from 'react';

// Define la interfaz para el estado del formulario

export interface InterfaceUbicacion {
    pais:string;
    direccion:string;
    estado:string;
    codigoPostal:number;
    ciudad_municipio:string;
    numExt?:string;
    numInt?:string;
    latitud:number;
    longitud:number;
    [key : string] : any
}

export interface Inmueble {
    tipoInmueble: string;
    servicios: string[];
    amenidades: string[];
    numRecamaras: number;
    numCamas: number;
    numBanos: number;
    numHuespedes: number;
    capEstacionamiento: number,
    fotos: File[];
    ubicacion: InterfaceUbicacion;
    titulo:string;
    descripcion: string;
    reglas: string[];
    precio: number;
    [key : string]: any
}

// valores por defecto para el inmueble
const valoresDefectoUbicacion : InterfaceUbicacion = {
    pais: '',
    direccion: '',
    estado: '',
    codigoPostal: -1,
    ciudad_municipio: '',
    latitud: 0,
    longitud: 0,
}

const valoresDefectoInmueble : Inmueble = {
    tipoInmueble: '',
    servicios: [],
    amenidades: [],
    numRecamaras: 0,
    numCamas: 0,
    numBanos: 0,
    numHuespedes: 0,
    capEstacionamiento: 0,
    fotos: [],
    ubicacion: valoresDefectoUbicacion,
    titulo:'',
    descripcion: '',
    reglas: [],
    precio: 0,
}

// Interfaz para el contexto
interface FormularioContextProps {
    inmueble: Inmueble;
    setInmueble: (data: Partial<Inmueble>) => void;  // Función para actualizar el inmueble
    reiniciarValores: () => void // función para reiniciar los valores actuales a valores por defecto
}

// Crear el contexto
const FormularioContext = createContext<FormularioContextProps | undefined>(undefined);

// Proveedor del contexto
export const FormularioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Definir el estado inicial del inmueble
    const [inmueble, setInmuebleState] = useState<Inmueble>(valoresDefectoInmueble);

    // Función para actualizar el estado del inmueble
    const setInmueble = (data: Partial<Inmueble>) => {
        setInmuebleState((prev) => ({ ...prev, ...data }));
    };

    // función para reiniciar los valores del inmueble
    const reiniciarValores = () => {
        setInmuebleState(valoresDefectoInmueble);
    }

    return (
        <FormularioContext.Provider value={{ inmueble, setInmueble, reiniciarValores }}>
            {children}
        </FormularioContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useFormulario = () => {
    const context = useContext(FormularioContext);
    if (!context) {
        throw new Error('useFormulario debe ser usado dentro de un FormularioProvider');
    }
    return context;
};
