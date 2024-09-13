import React, { createContext, useContext, useState } from 'react';

// Define la interfaz para el estado del formulario
interface Inmueble {
    tipoInmueble: string;
    servicios: string[];
    amenidades: string[];
    numRecamaras: number;
    numCamas: number;
    numBanos: number;
    numHuespedes: number;
    fotos: string[];
    descripcion: string;
    reglas: string;
    costo: number;
    [key : string]: any
}

// Interfaz para el contexto
interface FormularioContextProps {
    inmueble: Inmueble;
    setInmueble: (data: Partial<Inmueble>) => void;  // Función para actualizar el inmueble
}

// Crear el contexto
const FormularioContext = createContext<FormularioContextProps | undefined>(undefined);

// Proveedor del contexto
export const FormularioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Definir el estado inicial del inmueble
    const [inmueble, setInmuebleState] = useState<Inmueble>({
        tipoInmueble: '',
        servicios: [],
        amenidades: [],
        numRecamaras: 1,
        numCamas: 1,
        numBanos: 1,
        numHuespedes: 1,
        fotos: [],
        descripcion: '',
        reglas: '',
        costo: 0,
    });

    // Función para actualizar el estado del inmueble
    const setInmueble = (data: Partial<Inmueble>) => {
        setInmuebleState((prev) => ({ ...prev, ...data }));
    };

    return (
        <FormularioContext.Provider value={{ inmueble, setInmueble }}>
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
