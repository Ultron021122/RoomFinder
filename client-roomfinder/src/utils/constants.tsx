import { UniversityData, Roles, MapCoordenada, Folder } from '@/utils/interfaces';
import { height } from '@mui/system';

// Iconos
// ...

// Constants - Messages or data
export const messages = {
    roleid: {
        required: "Selecciona un tipo de usuario"
    },
    vchname: {
        required: "Debes introducir un nombre",
        min: "Debe ser mayor a 3 caracteres",
        max: "Debe ser menor a 25 caracteres"
    },
    vchpaternalsurname: {
        required: "Debes introducir el apellido paterno",
        min: "Debe ser mayor a 3 caracteres",
        max: "Debe ser menor a 25 caracteres"
    },
    vchmaternalsurname: {
        required: "Debes introducir el apellido materno",
        min: "Debe ser mayor a 3 caracteres",
        max: "Debe ser menor a 25 caracteres"
    },
    vchemail: {
        required: "Correo electrónico es requerido",
        pattern: "Debes introducir una dirección correcta",
    },
    vchpassword: {
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
    dtbirthdate: {
        required: "Fecha de nacimiento es requerida",
        age: "Debes ser mayor de edad"
    },
    profilImage: {
        required: "Imagen de perfil es requerida"
    },
    vchimage: {
        required: "Imagen es requerida"
    },
    intcodestudent: {
        required: "Código de estudiante es requerido",
        min: "No es un código de estudiante válido",
        max: "No es un código de estudiante válido"
    },
    vchuniversity: {
        required: "Universad es requerida"
    },
    vchphone: {
        required: "Teléfono es requerido",
    },
    intzip: {
        required: "Código postal es requerido",
        min: "No es un código postal válido",
        max: "No es un código postal válido"
    },
    vchstreet: {
        required: "El campo Calle es requerido",
    },
    vchsuburb: {
        required: "El campo Colonia es requerido",
    },
    vchmunicipality: {
        required: "El campo Municipio es requerido",
    },
    vchstate: {
        required: "El campo Estado es requerido",
    },
    folder: {
        required: "El campo Carpeta es requerido",
    },
    width: {
        required: "El campo Ancho es requerido",
        min: "El ancho debe ser mayor a 0",
        max: "El ancho debe ser menor a 1800"
    },
    height: {
        min: "El ancho debe ser mayor a 0",
        max: "El ancho debe ser menor a 1800"
    },
}

export const images = [
    {
        name: 'portada',
        url: 'https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg',
    },
    {
        name: 'portada2',
        url: 'https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg',
    },
];

export const patterns = {
    vchemail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    vchpassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
    code_student: /^[0-9]{8}$/,
    uuidv4: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
};

export const roles: Roles[] = [
    {
        roleid: 1,
        vchname: "Estudiante",
        vchdescription: "Usuario tipo estudiante",
    },
    {
        roleid: 2,
        vchname: "Arrendador",
        vchdescription: "Usuario tipo Arrendador",
    },
]

export const folders: Folder[] = [
    {
        name: "Estudiante",
        path: "students",
    },
    {
        name: "Arrendador",
        path: "lessors",
    },
    {
        name: "Propiedades",
        path: "properties",
    },
    {
        name: "Recursos",
        path: "resources",
    },
]

// Pruebas Universities
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
// Pruebas Properties
export const properties: MapCoordenada[] = [
    {
        geocode: [20.656114, -103.331217],
        popUp: "Propiedad Número 1"
    },
    {
        geocode: [20.651617, -103.324075],
        popUp: "Propiedad Número 2"
    },
    {
        geocode: [20.657007, -103.316989],
        popUp: "Propiedad Número 3"
    },
    {
        geocode: [20.659820, -103.328892],
        popUp: "Propiedad Número 4"
    },
    {
        geocode: [20.650588, -103.329476],
        popUp: "Propiedad Número 5"
    },
    {
        geocode: [20.653525, -103.319747],
        popUp: "Propiedad Número 6"
    }
];