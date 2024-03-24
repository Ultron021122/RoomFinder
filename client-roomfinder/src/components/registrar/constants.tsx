export interface University {
    name: string;
}

export const messages = {
    required: "Este campo es obligatorio",
    type_user: "Selecciona un tipo de usuario",
    name: "Debes introducir un nombre",
    last_name: "Debes introducir los apellidos correctamente",
    email: "Debes introducir una dirección correcta",
    password: "Debes introducir una contraseña que cumpla los requerimientos",
    birthday: "Introduce una fecha correcta"
}

export const patterns = {
    email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
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