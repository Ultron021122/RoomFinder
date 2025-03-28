import { Spinner } from "@nextui-org/react";
import { ESTUDIANTE, ARRENDADOR } from "./constants";
import { messages } from "./constants";
import { subYears } from "date-fns";
import { Coordinate, searchDistance, UniversityData } from "./interfaces";

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

export const validateDate = (value: string) => {
    const fechaNacimiento = new Date(value);
    const fechaActual = new Date();
    const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    return edad >= 18 || messages.dtbirthdate.age;
}

export const fifteenYearsAgo = subYears(new Date(), 15);


export function generatePassword(length: number = 12): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}


export default getFullName;

export function arrayToCoordinate(arr: [number, number]): Coordinate {
    return { lat: arr[0], lng: arr[1] };
}

export function haversineDistance(coord1: Coordinate, coord2: Coordinate): number {
    const toRadians = (degree: number): number => degree * (Math.PI / 180);
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLon = toRadians(coord2.lng - coord1.lng);
    const lat1 = toRadians(coord1.lat);
    const lat2 = toRadians(coord2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; // Distancia en kilómetros
}

export function findClosestCoordinate(target: Coordinate, coordinates: UniversityData[]): searchDistance | null {
    let closest: searchDistance | null = null;
    let minDistance = Infinity;

    coordinates.forEach((coord) => {
        let value = arrayToCoordinate(coord.geocode)
        const distance = haversineDistance(target, value);
        if (distance < minDistance) {
            minDistance = distance;
            closest = {
                name: coord.name,
                geocode: coord.geocode,
                popUp: coord.popUp,
                description: coord.description,
                imageUrl: coord.imageUrl,
                website: coord.website,
                fldistanceuniversity: distance
            }
        }
    });

    return closest;
}