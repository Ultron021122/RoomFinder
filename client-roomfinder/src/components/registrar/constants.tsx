export interface University {
    name: string;
}

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
    code_student: {
        required: "Código de estudiante es requerido"
    },
    university: {
        required: "Universad es requerida"
    },
    phone: {
        required: "Teléfono es requerido",
    },
    zip: {
        required: "Código postal es requerido",
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
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-.])*$/
    // email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
};

export const universities: University[] = [
    {
        name: "Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)"
    },
    {
        name: "Centro Universitario de Arte, Arquitectura y Diseño (CUAAD)"
    },
    {
        name: "Centro Universitario de Ciencias Biológicas y Agropecuarias (CUCBA)"
    },
    {
        name: "Centro Universitario de Ciencias Económico Administrativas (CUCEA)"
    },
    {
        name: "Centro Universitario de Ciencias de la Salud (CUCS)"
    },
    {
        name: "Centro Universitario de Ciencias Sociales y Humanidades (CUCSH)"
    },
    {
        name: "Centro Universitario de la Ciénega (CUCIÉNEGA)"
    },
    {
        name: "Centro Universitario de la Costa (CUCOSTA)"
    },
    {
        name: "Centro Universitario del Sur (CUCSUR)"
    },
    {
        name: "Centro Universitario de los Lagos (CULAGOS)"
    },
    {
        name: "Centro Universitario del Norte (CUNORTE)"
    },
    {
        name: "Centro Universitario del Sur (CUSUR)"
    },
    {
        name: "Centro Universitario de Tonalá (CUTONALÁ)"
    },
    {
        name: "Centro Universitario de los Valles (CUVALLES)"
    }
]