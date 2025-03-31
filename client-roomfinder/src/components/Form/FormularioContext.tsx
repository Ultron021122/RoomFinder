import React, { createContext, useContext, useState } from 'react';

// Define la interfaz para el estado del formulario

export interface InterfaceUbicacion {
    pais: string;
    direccion: string;
    estado: string;
    calle: string;
    colonia: string;
    codigoPostal: number;
    ciudad_municipio: string;
    numExt?: string;
    numInt?: string;
    latitud: number;
    longitud: number;
    [key: string]: any
}

export interface ServicesAmenities {
    bnWaterIncluded?: boolean;
    bnElectricityIncluded?: boolean;
    bnInternetIncluded?: boolean;
    bnGasIncluded?: boolean;
    bnHeatingIncluded?: boolean;
    bnAirConditioningIncluded?: boolean;
    bnLaundryIncluded?: boolean;
    bnParkingIncluded?: boolean;
    bnCleaningIncluded?: boolean;
    bnCableTVIncluded?: boolean;
    bnWashingMachineIncluded?: boolean;
    bnKitchen?: boolean;
    bnLivingRoom?: boolean;
    bnDiningRoom?: boolean;
    bnCoolerIncluded?: boolean;
    bnGardenIncluded?: boolean;
    bnWashingArea?: boolean;
}

export interface Inmueble {
    lessorId?: number;
    tipoInmueble: number;
    servicios: ServicesAmenities;
    numRecamaras: number;
    numCamas: number;
    numBanos: number;
    numHuespedes: number;
    capEstacionamiento: number,
    fotos: string[];
    ubicacion: InterfaceUbicacion;
    titulo: string;//
    descripcion: string;//
    reglas: string[];//
    precio: number;
    vchbuildingsecurity: string;
    vchtransportationaccess: string,
    bnfurnished: boolean;
    vchfurnituretype: string;
    bnStudyZone: boolean;
    intmincontractduration: number;
    intmaxcontractduration: number;
    additionalFeatures: AdditionalFeatures;
    [key: string]: any
}

export interface AdditionalFeatures {
    decarea: number;
    fldistanceuniversity: number;
    vchadditionalfeatures: string;
    vchuniversity: string;
}

const valoresAdditionalFeatures: AdditionalFeatures = {
    decarea: 0,
    fldistanceuniversity: 0,
    vchadditionalfeatures: '',
    vchuniversity: ''
}

// valores por defecto para el inmueble
const valoresDefectoUbicacion: InterfaceUbicacion = {
    pais: '',
    direccion: '',
    estado: '',
    calle: '',
    colonia: '',
    codigoPostal: -1,
    ciudad_municipio: '',
    latitud: 0,
    longitud: 0,
}

// valores por defecto para el inmueble
const valoresDefectoServiciosAmenidades: ServicesAmenities = {
    bnWaterIncluded: false,
    bnElectricityIncluded: false,
    bnInternetIncluded: false,
    bnGasIncluded: false,
    bnHeatingIncluded: false,
    bnAirConditioningIncluded: false,
    bnLaundryIncluded: false,
    bnParkingIncluded: false,
    bnCleaningIncluded: false,
    bnCableTVIncluded: false,
    bnWashingMachineIncluded: false,
    bnKitchen: false,
    bnLivingRoom: false,
    bnDiningRoom: false,
    bnCoolerIncluded: false,
    bnGardenIncluded: false,
    bnWashingArea: false
}

const valoresDefectoInmueble: Inmueble = {
    tipoInmueble: 1,
    servicios: valoresDefectoServiciosAmenidades,
    numRecamaras: 1,
    numCamas: 0,
    numBanos: 0,
    numHuespedes: 0,
    capEstacionamiento: 0,
    fotos: [],
    ubicacion: valoresDefectoUbicacion,
    titulo: '',
    descripcion: '',
    reglas: [],
    precio: 0,
    vchbuildingsecurity: '',
    vchtransportationaccess: '',
    bnfurnished: false,
    vchfurnituretype: '',
    bnStudyZone: false,
    intmincontractduration: 1,
    intmaxcontractduration: 2,
    additionalFeatures: valoresAdditionalFeatures
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
