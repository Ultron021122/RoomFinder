import axios from "axios";
import { NextResponse } from "next/server";
import { deleteImage, uploadImage } from "../cloudinary";

export async function POST(req, res) {
    const {
        lessor_id,
        tipoInmueble,
        servicios,
        amenidades,
        numRecamaras,
        numCamas,
        numBanos,
        numHuespedes,
        capEstacionamiento,
        fotos, // Array de fotos
        ubicacion,
        titulo,
        descripcion,
        reglas,
        precio
    } = await req.json();

    // Array para almacenar las URLs de las imágenes subidas
    const imageUrls = [];

    // Subir cada imagen
    try {
        for (const foto of fotos) {
            const imageUrl = await uploadImage(
                foto.path, // Asegúrate de que el path sea la ruta correcta de la imagen
                'properties', // Nombre de la carpeta en la que se va a almacenar los archivos
                {
                    transformation: [
                        { width: 800, height: 600, crop: "fill" },
                        { quality: "auto" },
                        { format: "jpg" }
                    ]
                }
            );
            imageUrls.push(imageUrl.secure_url); // Almacena la URL
        }
    } catch (error) {
        return NextResponse.json(
            { messages: "Error al subir las imágenes" },
            { status: 503 }
        );
    }

    // Realizar la solicitud POST para guardar la información
    try {
        const response = await axios.post(`${process.env.REST_URL}/properties/`, {
            type_house: tipoInmueble.toLowerCase(),
            lessor_id: lessorId || 1, // Cambiar por el ID del lessor actual
            country: ubicacion.pais,
            street: ubicacion.direccion,
            state: ubicacion.estado,
            zip: ubicacion.codigoPostal,
            municipality: ubicacion.ciudad_municipio,
            num_ext: ubicacion.numExt,
            num_int: ubicacion?.numInt,
            lat: ubicacion.latitud,
            lng: ubicacion.longitud,
            title: titulo,
            description: descripcion,
            availability: 0,
            price: precio,
            rules: reglas,
            servicios,
            amenidades,
            numRecamaras,
            numCamas,
            numBanos,
            numHuespedes,
            capEstacionamiento,
            fotos: imageUrls, // Actualiza con las URLs de las imágenes
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        const statusMessageMap = {
            201: { message: 'Propiedad creada correctamente', data: response.data },
            409: { message: 'Conflicto en la creación' },
            400: { message: response.data.message },
            default: { message: 'Error al crear la propiedad' },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message },
            { status: response.status }
        );

    } catch (error) {
        console.error(error);
        // Limpiar las imágenes subidas si es necesario
        for (const imageUrl of imageUrls) {
            const publicId = imageUrl.split('/').pop().split('.')[0]; // Obtener el public_id de la URL
            await deleteImage(publicId);
        }
        return NextResponse.json(
            { message: 'Error al guardar la propiedad' },
            { status: 503 }
        );
    }
}
