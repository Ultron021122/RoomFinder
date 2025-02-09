import { UniversityData, Roles, MapCoordenada, Folder } from '@/utils/interfaces';
import { url } from 'inspector';

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
    vchmajor: {
        required: "La carrera es obligatoria",
        min: "Número de caracteres mínimo no alcanzado"
    },
    vchphone: {
        required: "Teléfono es requerido",
        length: "Este campo debe contener 10 dígitos"
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
    vchbiography: {
        min: "La biografía debe contener mínimo 50 caracteres",
        max: "Número de caracteres excedido. Máximo 255"
    }
    ,
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
    vchtitle: {
        required: "El campo Título es requerido",
        min: "El título debe ser mayor a 3 caracteres",
        max: "El título debe ser menor a 25 caracteres"
    },
    intnumberrooms: {
        required: "El campo Número de habitaciones es requerido",
        min: "El número de habitaciones debe ser mayor a 0",
        max: "El número de habitaciones debe ser menor a 10"
    },
    intnumberbathrooms: {
        required: "El campo Número de baños es requerido",
        min: "El número de baños debe ser mayor a 0",
        max: "El número de baños debe ser menor a 10"
    },
    intmaxoccupacy: {
        required: "El campo Ocupación máxima es requerido",
        min: "La ocupación minima debe ser 1",
        max: "La ocupación máxima debe ser menor a 20"
    },
    bnfurnished: {
        required: "El campo Amueblado es requerido",
    },
    vchfurnituretype: {
        required: "Debes introducir un tipo de mueble",
    },
    decrentalcost: {
        required: "El campo Costo de renta es requerido",
        min: "El costo de renta debe ser mayor a 0",
        max: "El costo de renta debe ser menor a 99999999"
    },
    dtavailabilitydate: {
        required: "Debes introducir una fecha de disponibilidad",
    },
    intmincontractduration: {
        required: "El campo Duración mínima de contrato es requerido",
        min: "La duración mínima de contrato es de 1 mes",
        max: "La duración mínima de contrato es de 12 meses"
    },
    intmaxcontractduration: {
        required: "El campo Duración máxima de contrato es requerido",
        min: "La duración máxima de contrato es de 1 mes",
        max: "La duración máxima de contrato es de 12 meses"
    },
    decpropertyrating: {
        required: "El campo Calificación es requerido",
        min: "La calificación debe ser mayor a 0",
        max: "La calificación debe ser menor a 5"
    },
    vchaddrescomplement: {
        required: "El campo Complemento de dirección es requerido",
    },
    bnstudyzone: {
        required: "El campo Zona de estudio es requerido",
    },
    vchbuildingsecurity: {
        required: "El campo Seguridad del edificio es requerido",
    },
    vchtransportationaccess: {
        required: "El campo Acceso a transporte es requerido",
    },
    vchpropertyrules: {
        required: "El campo Reglas de la propiedad es requerido",
    },
    vchdescription: {
        required: "El campo Descripción es requerido",
        min: "La descripción debe ser mayor a 3 caracteres",
        max: "La descripción debe ser menor a 250 caracteres"
    },
    vchexteriornumber: {
        required: "El campo Número exterior es requerido",
    },
    vchinteriornumber: {
        required: "El campo Número interior es requerido",
    },
    vchaddresscomplement: {
        required: "El campo Complemento de dirección es requerido",
    },
    vchcountry: {
        required: "El campo País es requerido",
    },
    bnwaterincluded: {
        required: "El campo Agua incluida es requerido",
    },
    bnelectricityincluded: {
        required: "El campo Luz incluida es requerido",
    },
    bninternetincluded: {
        required: "El campo Internet incluido es requerido",
    },
    bngasincluded: {
        required: "El campo Gas incluido es requerido",
    },
    bnheatingincluded: {
        required: "El campo Calefacción incluida es requerido",
    },
    bnaireconditioningincluded: {
        required: "El campo Aire acondicionado incluido es requerido",
    },
    bnlaundryincluded: {
        required: "El campo Lavandería incluida es requerido",
    },
    bnparkingincluded: {
        required: "El campo Estacionamiento incluido es requerido",
    },
    bncleaningincluded: {
        required: "El campo Limpieza incluida es requerido",
    },
    bncabletvincluded: {
        required: "El campo TV por cable incluida es requerido",
    },
    decarea: {
        required: "El campo Área es requerido",
        min: "El área debe ser mayor a 0",
        max: "El área debe ser menor a 999"
    },
    fldistanceuniversity: {
        required: "El campo Distancia a la universidad es requerido",
        min: "La distancia a la universidad debe ser mayor a 0",
        max: "La distancia a la universidad debe ser menor a 999"
    },
    vchadditionalfeatures: {
        required: "El campo Características adicionales es requerido",
    },
    vchtoken: {
        required: "El campo Token es requerido",
        pattern: "No es un token válido",
        min: 'El token debe ser de 8 caracteres',
        max: 'El token debe ser de 8 caracteres'
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
    vchtoken: /^[A-Za-z0-9]{8}$/,
};

export const role: Roles[] = [
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
    {
        roleid: 3,
        vchname: "Administrador",
        vchdescription: "Usuario tipo Administrador",
    }
]
// Constants - Data
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
    }
]
// Mapeo de roles
export const rolesMapping: Record<number, string> = role.reduce((acc, rol) => {
    acc[rol.roleid] = rol.vchname;
    return acc;
}, {} as Record<number, string>);

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
        popUp: "Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)",
        description: "El CUCEI se especializa en las áreas de ciencias exactas e ingenierías, ofreciendo programas académicos de alta calidad en física, matemáticas, química, ingeniería y más.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717298042/resources/jbfy37uv95ufwmxqtz3a.jpg",
        website: "https://www.cucei.udg.mx/"
    },
    {
        name: "Centro Universitario de Arte, Arquitectura y Diseño (CUAAD)",
        geocode: [20.738857, -103.311808],
        popUp: "Centro Universitario de Arte, Arquitectura y Diseño (CUAAD)",
        description: "El CUAAD es el principal centro universitario en artes, arquitectura y diseño. Ofrece programas innovadores y cuenta con instalaciones de vanguardia.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717298769/resources/zftbxg14q7wasjcaorcp.jpg",
        website: "https://www.cuaad.udg.mx/"
    },
    {
        name: "Centro Universitario de Ciencias Biológicas y Agropecuarias (CUCBA)",
        geocode: [20.746758, -103.513747],
        popUp: "Centro Universitario de Ciencias Biológicas y Agropecuarias (CUCBA)",
        description: "El CUCBA se dedica a la formación y desarrollo en ciencias biológicas y agropecuarias, con investigaciones que contribuyen al desarrollo sostenible.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717295441/resources/e9zujzehbh1go1dso14t.jpg",
        website: "https://www.cucba.udg.mx/"
    },
    {
        name: "Centro Universitario de Ciencias Económico Administrativas (CUCEA)",
        geocode: [20.739602, -103.381788],
        popUp: "Centro Universitario de Ciencias Económico Administrativas (CUCEA)",
        description: "El CUCEA es reconocido por su excelencia en las ciencias económicas y administrativas, ofreciendo programas educativos que preparan a líderes en negocios y finanzas.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717299202/resources/ocsvevpup1d0wxr7awqg.jpg",
        website: "https://www.cucea.udg.mx/"
    },
    {
        name: "Centro Universitario de Ciencias de la Salud (CUCS)",
        geocode: [20.686401, -103.331540],
        popUp: "Centro Universitario de Ciencias de la Salud (CUCS)",
        description: "El CUCS es un centro de referencia en ciencias de la salud, con programas educativos en medicina, enfermería, odontología, y más.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717299812/resources/rvvrzuz4gie9jrevzfhb.jpg",
        website: "https://www.cucs.udg.mx/"
    },
    {
        name: "Centro Universitario de Ciencias Sociales y Humanidades (CUCSH)",
        geocode: [20.693131, -103.349932],
        popUp: "Centro Universitario de Ciencias Sociales y Humanidades (CUCSH)",
        description: "El CUCSH se especializa en las ciencias sociales y humanidades, ofreciendo programas en áreas como derecho, sociología, historia y más.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717299889/resources/cn2o7cfvlbv5mkzriznu.jpg",
        website: "https://www.cucsh.udg.mx/"
    },
    {
        name: "Centro Universitario de la Ciénega (CUCIÉNEGA)",
        geocode: [20.370837, -102.768468],
        popUp: "Centro Universitario de la Ciénega (CUCIÉNEGA)",
        description: "El CUCIÉNEGA ofrece programas educativos enfocados en el desarrollo regional, ciencias naturales y humanidades.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717300203/resources/ipozv6we3jsdk2ibnuny.jpg",
        website: "https://www.cucienega.udg.mx/"
    },
    {
        name: "Centro Universitario de la Costa (CUCOSTA)",
        geocode: [20.706166, -105.220636],
        popUp: "Centro Universitario de la Costa (CUCOSTA)",
        description: "El CUCOSTA es un centro educativo ubicado en la costa del Pacífico, con programas en turismo, biología marina, y desarrollo sustentable.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717300356/resources/n9wubz2sfkdndnt26t95.jpg",
        website: "https://www.cucosta.udg.mx/"
    },
    {
        name: "Centro Universitario de la Costa Sur (CUCSUR)",
        geocode: [19.774326, -104.357906],
        popUp: "Centro Universitario de la Costa Sur (CUCSUR)",
        description: "El CUCSUR se enfoca en la investigación y formación en áreas como la agroecología, gestión ambiental y desarrollo rural.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717300468/resources/mltjqiw8o81ir40osdd5.jpg",
        website: "https://www.cucsur.udg.mx/"
    },
    {
        name: "Centro Universitario de los Lagos (CULAGOS)",
        geocode: [21.356874, -101.951558],
        popUp: "Centro Universitario de los Lagos (CULAGOS)",
        description: "El CULAGOS ofrece programas en ingeniería, ciencias sociales y humanidades, con un enfoque en el desarrollo local y regional.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717300616/resources/k0lsuwdpfrohxebxyv3u.jpg",
        website: "https://www.lagos.udg.mx/"
    },
    {
        name: "Centro Universitario del Norte (CUNORTE)",
        geocode: [22.136822, -103.243725],
        popUp: "Centro Universitario del Norte (CUNORTE)",
        description: "El CUNORTE se dedica a la formación en áreas como la administración, educación y ciencias sociales, promoviendo el desarrollo del norte de Jalisco.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717300743/resources/tgrouwdqe6qzrar3z6b7.jpg",
        website: "https://www.cunorte.udg.mx/"
    },
    {
        name: "Centro Universitario del Sur (CUSUR)",
        geocode: [19.723689, -103.462188],
        popUp: "Centro Universitario del Sur (CUSUR)",
        description: "El CUSUR ofrece programas académicos en áreas como la salud, ciencias sociales y económicas, con un fuerte compromiso con la investigación.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717300822/resources/y8lwjucfjhki0zepgcnv.jpg",
        website: "https://www.cusur.udg.mx/"
    },
    {
        name: "Centro Universitario de Tonalá (CUTONALÁ)",
        geocode: [20.566657, -103.225693],
        popUp: "Centro Universitario de Tonalá (CUTONALÁ)",
        description: "El CUTONALÁ se enfoca en la formación profesional en áreas como la ingeniería, ciencias sociales y humanidades, con una visión integral del desarrollo.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717300953/resources/dihvulkmx5uvxfdngwyv.jpg",
        website: "https://www.cutonalá.udg.mx/"
    },
    {
        name: "Centro Universitario de los Valles (CUVALLES)",
        geocode: [20.534568, -103.967400],
        popUp: "Centro Universitario de los Valles (CUVALLES)",
        description: "El CUVALLES se dedica a la enseñanza en áreas como la administración, agronomía y ciencias sociales, apoyando el desarrollo de la región de los Valles.",
        imageUrl: "https://res.cloudinary.com/dal8aivch/image/upload/v1717301045/resources/andg8kljwz0dwxlg7hcz.jpg",
        website: "https://www.cuvalles.udg.mx/"
    }
];
// Pruebas Properties
export const properties: MapCoordenada[] = [
    {
        geocode: [20.656114, -103.331217],
        popUp: "Propiedad Número 1",
        vchtitle: "Casa en renta",
        vchdescription: "Hermosa casa en la playa con vista al mar.",
        decpropertyrating: 4.0,
        imagenesUrl: [
            { id: 1, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg" },
            { id: 2, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" },
            { id: 3, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" }
        ],
        propertyid: 1,
    },
    {
        geocode: [20.651617, -103.324075],
        popUp: "Propiedad Número 2",
        vchtitle: "Casa en renta",
        vchdescription: "Hermosa casa en la playa con vista al mar.",
        decpropertyrating: 4.0,
        imagenesUrl: [
            { id: 1, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg" },
            { id: 2, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" },
            { id: 3, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" }
        ],
        propertyid: 1,
    },
    {
        geocode: [20.657007, -103.316989],
        popUp: "Propiedad Número 3",
        vchtitle: "Casa en renta",
        vchdescription: "Hermosa casa en la playa con vista al mar.",
        decpropertyrating: 4.0,
        imagenesUrl: [
            { id: 1, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg" },
            { id: 2, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" },
            { id: 3, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" }
        ],
        propertyid: 1,
    },
    {
        geocode: [20.659820, -103.328892],
        popUp: "Propiedad Número 4",
        vchtitle: "Casa en renta",
        vchdescription: "Hermosa casa en la playa con vista al mar.",
        decpropertyrating: 4.0,
        imagenesUrl: [
            { id: 1, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg" },
            { id: 2, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" },
            { id: 3, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" }
        ],
        propertyid: 1,
    },
    {
        geocode: [20.650588, -103.329476],
        popUp: "Propiedad Número 5",
        vchtitle: "Casa en renta",
        vchdescription: "Hermosa casa en la playa con vista al mar.",
        decpropertyrating: 4.0,
        imagenesUrl: [
            { id: 1, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg" },
            { id: 2, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" },
            { id: 3, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" }
        ],
        propertyid: 1,
    },
    {
        geocode: [20.653525, -103.319747],
        popUp: "Propiedad Número 6",
        vchtitle: "Casa en renta",
        vchdescription: "Hermosa casa en la playa con vista al mar.",
        decpropertyrating: 4.0,
        imagenesUrl: [
            { id: 1, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg" },
            { id: 2, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" },
            { id: 3, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" }
        ],
        propertyid: 1,
    }
];

// Properties - Home
export const propertiesHome = [
    {
        id: 1,
        title: "Rancho El Paraíso",
        description: "Esta es la tercera y más grande cabaña de Rancho El Paraíso, ubicada en el interior de la sierra con un camino de terracería, para ser exactos está en el kilómetro 11.5 de Atemajac de Brizuela-Divisadero.",
        value: 4.0,
        imagenesUrl: [
            { id: 1, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg" },
            { id: 2, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" },
            { id: 3, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" }
        ],
    },
    {
        id: 2,
        title: "Departamento en renta",
        description: "Departamento en el centro de la ciudad.",
        value: 3.5,
        imagenesUrl: [
            { id: 1, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg" },
            { id: 2, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" },
            { id: 3, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" }
        ],
    },
    {
        id: 3,
        title: "Casa en la montaña",
        description: "Casa en la montaña con vista a la ciudad.",
        value: 5.0,
        imagenesUrl: [
            { id: 1, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713591079/resources/gzd4czbpdy9ksy3tw8fv.jpg" },
            { id: 2, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" },
            { id: 3, url: "https://res.cloudinary.com/dal8aivch/image/upload/v1713586413/resources/up7t5qoheawy9ejra0xy.jpg" }
        ],
    },
]

export const columns = [
    { name: "Id", uid: "id", sortable: true },
    { name: "Nombre", uid: "name", sortable: true },
    { name: "Edad", uid: "age", sortable: true },
    { name: "Role", uid: "role", sortable: true },
    { name: "Team", uid: "team" },
    { name: "Email", uid: "email" },
    { name: "Status", uid: "status", sortable: true },
    { name: "Actions", uid: "actions" },
];

export const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Paused", uid: "paused" },
    { name: "Vacation", uid: "vacation" },
];

export const itemDataImage = [
    {
        img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110?w=500',
        title: 'Bed',
    },
    {
        img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31?w=500',
        title: 'Books',
    },
    {
        img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=500',
        title: 'Sink',
    },
    {
        img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=500',
        title: 'Kitchen',
    },
    {
        img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3?w=500',
        title: 'Blinds',
    },
    {
        img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=500',
        title: 'Chairs',
    },
    {
        img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=500',
        title: 'Laptop',
    },
    {
        img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=500',
        title: 'Doors',
    },
    {
        img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500',
        title: 'Coffee',
    },
    {
        img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?w=500',
        title: 'Storage',
    },
    {
        img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?w=500',
        title: 'Candle',
    },
    {
        img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500',
        title: 'Coffee table',
    },
];

export const users = [
    {
        id: 1,
        name: "Tony Reichert",
        role: "CEO",
        team: "Management",
        status: "active",
        age: "29",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com",
    },
    {
        id: 2,
        name: "Zoey Lang",
        role: "Tech Lead",
        team: "Development",
        status: "paused",
        age: "25",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "zoey.lang@example.com",
    },
    {
        id: 3,
        name: "Jane Fisher",
        role: "Sr. Dev",
        team: "Development",
        status: "active",
        age: "22",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "jane.fisher@example.com",
    },
    {
        id: 4,
        name: "William Howard",
        role: "C.M.",
        team: "Marketing",
        status: "vacation",
        age: "28",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        email: "william.howard@example.com",
    },
    {
        id: 5,
        name: "Kristen Copper",
        role: "S. Manager",
        team: "Sales",
        status: "active",
        age: "24",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        email: "kristen.cooper@example.com",
    },
    {
        id: 6,
        name: "Brian Kim",
        role: "P. Manager",
        team: "Management",
        age: "29",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "brian.kim@example.com",
        status: "Active",
    },
    {
        id: 7,
        name: "Michael Hunt",
        role: "Designer",
        team: "Design",
        status: "paused",
        age: "27",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d",
        email: "michael.hunt@example.com",
    },
    {
        id: 8,
        name: "Samantha Brooks",
        role: "HR Manager",
        team: "HR",
        status: "active",
        age: "31",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e27027008d",
        email: "samantha.brooks@example.com",
    },
    {
        id: 9,
        name: "Frank Harrison",
        role: "F. Manager",
        team: "Finance",
        status: "vacation",
        age: "33",
        avatar: "https://i.pravatar.cc/150?img=4",
        email: "frank.harrison@example.com",
    },
    {
        id: 10,
        name: "Emma Adams",
        role: "Ops Manager",
        team: "Operations",
        status: "active",
        age: "35",
        avatar: "https://i.pravatar.cc/150?img=5",
        email: "emma.adams@example.com",
    },
    {
        id: 11,
        name: "Brandon Stevens",
        role: "Jr. Dev",
        team: "Development",
        status: "active",
        age: "22",
        avatar: "https://i.pravatar.cc/150?img=8",
        email: "brandon.stevens@example.com",
    },
    {
        id: 12,
        name: "Megan Richards",
        role: "P. Manager",
        team: "Product",
        status: "paused",
        age: "28",
        avatar: "https://i.pravatar.cc/150?img=10",
        email: "megan.richards@example.com",
    },
    {
        id: 13,
        name: "Oliver Scott",
        role: "S. Manager",
        team: "Security",
        status: "active",
        age: "37",
        avatar: "https://i.pravatar.cc/150?img=12",
        email: "oliver.scott@example.com",
    },
    {
        id: 14,
        name: "Grace Allen",
        role: "M. Specialist",
        team: "Marketing",
        status: "active",
        age: "30",
        avatar: "https://i.pravatar.cc/150?img=16",
        email: "grace.allen@example.com",
    },
    {
        id: 15,
        name: "Noah Carter",
        role: "IT Specialist",
        team: "I. Technology",
        status: "paused",
        age: "31",
        avatar: "https://i.pravatar.cc/150?img=15",
        email: "noah.carter@example.com",
    },
    {
        id: 16,
        name: "Ava Perez",
        role: "Manager",
        team: "Sales",
        status: "active",
        age: "29",
        avatar: "https://i.pravatar.cc/150?img=20",
        email: "ava.perez@example.com",
    },
    {
        id: 17,
        name: "Liam Johnson",
        role: "Data Analyst",
        team: "Analysis",
        status: "active",
        age: "28",
        avatar: "https://i.pravatar.cc/150?img=33",
        email: "liam.johnson@example.com",
    },
    {
        id: 18,
        name: "Sophia Taylor",
        role: "QA Analyst",
        team: "Testing",
        status: "active",
        age: "27",
        avatar: "https://i.pravatar.cc/150?img=29",
        email: "sophia.taylor@example.com",
    },
    {
        id: 19,
        name: "Lucas Harris",
        role: "Administrator",
        team: "Information Technology",
        status: "paused",
        age: "32",
        avatar: "https://i.pravatar.cc/150?img=50",
        email: "lucas.harris@example.com",
    },
    {
        id: 20,
        name: "Mia Robinson",
        role: "Coordinator",
        team: "Operations",
        status: "active",
        age: "26",
        avatar: "https://i.pravatar.cc/150?img=45",
        email: "mia.robinson@example.com",
    },
];

export const comments = [
    {
        objuser: {
            vchname: "Juan Pérez",
            vchphoto: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        vchcomment: "Esta propiedad es increíble, definitivamente la recomendaría a mis amigos. El lugar tiene una vista espectacular y la atención fue excelente.",
    },
    {
        objuser: {
            vchname: "María González",
            vchphoto: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        vchcomment: "Un lugar muy acogedor. Me encantó todo, desde la decoración hasta la tranquilidad del entorno. ¡Volveré pronto!",
    },
    {
        objuser: {
            vchname: "Carlos Martínez",
            vchphoto: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        vchcomment: "Excelente ubicación, cerca de todo. Las instalaciones son de primera calidad y todo estaba muy limpio. Muy recomendable.",
    },
    {
        objuser: {
            vchname: "Laura Fernández",
            vchphoto: "https://randomuser.me/api/portraits/women/4.jpg",
        },
        vchcomment: "El servicio fue increíble y las vistas desde la propiedad son impresionantes. Definitivamente una experiencia de 5 estrellas.",
    },
];

export const reviews = [
    {
        id: 1,
        author: "María García",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        date: "15 de mayo, 2023",
        rating: 5,
        comment: "¡Excelente propiedad! La ubicación es perfecta y las instalaciones son de primera clase. Definitivamente volveré."
    },
    {
        id: 2,
        author: "Juan Pérez",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        date: "3 de abril, 2023",
        rating: 4,
        comment: "Muy buena experiencia en general. La propiedad estaba limpia y bien mantenida. Solo un pequeño problema con el aire acondicionado, pero se solucionó rápidamente."
    },
    {
        id: 3,
        author: "Ana Martínez",
        // avatar: "/placeholder.svg?text=AM",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        date: "20 de marzo, 2023",
        rating: 5,
        comment: "¡Increíble! La vista desde el balcón es espectacular y la atención del anfitrión fue excelente. Altamente recomendado."
    }
];

export const ARRENDADOR = 2;
export const ESTUDIANTE = 1;
export const PROFILE_IMAGE = 1;
export const COVER_IMAGE = 2;

export const AboutUs = [
    {
        "url": "/images/carrousel-about-us.jpg",
        "photoid": 325
    },
    {
        "url": "/images/carrousel-about-us-2.jpg",
        "photoid": 326
    },
    {
        "url": "/images/carrousel-about-us-3.jpg",
        "photoid": 326
    },
]