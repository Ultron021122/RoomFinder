import { UniversityData, Roles } from '@/utils/interfaces';

export const messages = {
    type_user: {
        required: "Selecciona un tipo de usuario"
    },
    name: {
        required: "Debes introducir un nombre",
        min: "Debe ser mayor a 3 caracteres",
        max: "Debe ser menor a 25 caracteres"
    },
    last_name: {
        required: "Debes introducir los apellidos correctamente"
    },
    email: {
        required: "Correo electrónico es requerido",
        pattern: "Debes introducir una dirección correcta",
    },
    password: {
        required: "Contraseña requerida",
        min: "Debe ser mayor a 8 caracteres",
        max: "Debe ser menor a 16 caracteres"
    },
    confirm_password: {
        required: "Confirmar contraseña es requerida",
        min: "Debe ser mayor a 8 caracteres",
        max: "Debe ser menor a 16 caracteres",
        validate: "Las contraseñas no coinciden"
    },
    birthday: {
        required: "Fecha de nacimiento es requerida",
        age: "Debes ser mayor de edad"
    },
    profilImage: {
        required: "Imagen de perfil es requerida"
    },
    code_student: {
        required: "Código de estudiante es requerido",
        min: "No es un código de estudiante válido",
        max: "No es un código de estudiante válido"
    },
    university: {
        required: "Universad es requerida"
    },
    phone: {
        required: "Teléfono es requerido",
    },
    zip: {
        required: "Código postal es requerido",
        min: "No es un código postal válido",
        max: "No es un código postal válido"
    },
    street: {
        required: "El campo Calle es requerido",
    },
    suburb: {
        required: "El campo Colonia es requerido",
    },
    municipality: {
        required: "El campo Municipio es requerido",
    },
    state: {
        required: "El campo Estado es requerido",
    },

}

export const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

export const roles: Roles[] = [
    {
        name: "Estudiante",
        value: "student",
    },
    {
        name: "Arrendador",
        value: "lessor",
    },
]

export const universities: UniversityData[] = [
    {
        name: "Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)",
        geocode: [20.655080, -103.325448],
        popUp: "Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)"
    },
    {
        name: "Centro Universitario de Arte, Arquitectura y Diseño (CUAAD)",
        geocode: [20.738857, -103.311808],
        popUp: "Centro Universitario de Arte, Arquitectura y Diseño (CUAAD)"
    },
    {
        name: "Centro Universitario de Ciencias Biológicas y Agropecuarias (CUCBA)",
        geocode: [20.746758, -103.513747],
        popUp: "Centro Universitario de Ciencias Biológicas y Agropecuarias (CUCBA)"
    },
    {
        name: "Centro Universitario de Ciencias Económico Administrativas (CUCEA)",
        geocode: [20.739602, -103.381788],
        popUp: "Centro Universitario de Ciencias Económico Administrativas (CUCEA)"
    },
    {
        name: "Centro Universitario de Ciencias de la Salud (CUCS)",
        geocode: [20.686401, -103.331540],
        popUp: "Centro Universitario de Ciencias de la Salud (CUCS)"
    },
    {
        name: "Centro Universitario de Ciencias Sociales y Humanidades (CUCSH)",
        geocode: [20.693131, -103.349932],
        popUp: "Centro Universitario de Ciencias Sociales y Humanidades (CUCSH)"
    },
    {
        name: "Centro Universitario de la Ciénega (CUCIÉNEGA)",
        geocode: [20.370837, -102.768468],
        popUp: "Centro Universitario de la Ciénega (CUCIÉNEGA)"
    },
    {
        name: "Centro Universitario de la Costa (CUCOSTA)",
        geocode: [20.706166, -105.220636],
        popUp: "Centro Universitario de la Costa (CUCOSTA)"
    },
    {
        name: "Centro Universitario de la Costa Sur (CUCSUR)",
        geocode: [19.774326, -104.357906],
        popUp: "Centro Universitario de la Costa Sur (CUCSUR)"
    },
    {
        name: "Centro Universitario de los Lagos (CULAGOS)",
        geocode: [21.356874, -101.951558],
        popUp: "Centro Universitario de los Lagos (CULAGOS)"
    },
    {
        name: "Centro Universitario del Norte (CUNORTE)",
        geocode: [22.136822, -103.243725],
        popUp: "Centro Universitario del Norte (CUNORTE)"
    },
    {
        name: "Centro Universitario del Sur (CUSUR)",
        geocode: [19.723689, -103.462188],
        popUp: "Centro Universitario del Sur (CUSUR)"
    },
    {
        name: "Centro Universitario de Tonalá (CUTONALÁ)",
        geocode: [20.566657, -103.225693],
        popUp: "Centro Universitario de Tonalá (CUTONALÁ)"
    },
    {
        name: "Centro Universitario de los Valles (CUVALLES)",
        geocode: [20.534568, -103.967400],
        popUp: "Centro Universitario de los Valles (CUVALLES)"
    }
]