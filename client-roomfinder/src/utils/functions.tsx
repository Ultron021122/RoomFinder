import { Spinner } from "@nextui-org/react";
import { ESTUDIANTE, ARRENDADOR } from "./constants";
import { messages } from "./constants";

interface fullName {
    vchname: string;
    vchpaternalsurname: string;
    vchmaternalsurname: string;
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getFullName = ({ vchname = '', vchpaternalsurname = '', vchmaternalsurname = '' }: fullName) => {
    // Validar que los campos no estén vacíos
    if (!vchname.trim() || !vchpaternalsurname.trim() || !vchmaternalsurname.trim()) {
        //throw new Error("Todos los campos deben ser proporcionados y no pueden estar vacíos.");
        return <Spinner />;
    }
    return `${vchname} ${vchpaternalsurname} ${vchmaternalsurname}`;
}

export const shortName = ({ vchname = '', vchpaternalsurname = '', vchmaternalsurname = '' }: fullName) => {
    // Validar que los campos no estén vacíos
    if (!vchname.trim() || !vchpaternalsurname.trim() || !vchmaternalsurname.trim()) {
        //throw new Error("Todos los campos deben ser proporcionados y no pueden estar vacíos.");
        return <Spinner />;
    }
    let length = vchname.length + vchpaternalsurname.length + vchmaternalsurname.length;
    if (length > 20) {
        return `${vchname} ${vchpaternalsurname.substring(0, 1)}. ${vchmaternalsurname.substring(0, 1)}.`;
    }
    return `${vchname} ${vchpaternalsurname} ${vchmaternalsurname}`;
}

export const validateDate = (value : string) => {
    const fechaNacimiento = new Date(value);
    const fechaActual = new Date();
    const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    return edad >= 18 || messages.dtbirthdate.age;
}

export default getFullName;