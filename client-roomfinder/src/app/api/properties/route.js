import axios from "axios";
import { NextResponse } from "next/server";
import { deleteImage, uploadImage } from "../cloudinary";

export async function GET(request) {
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.REST_URL}/properties`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error.response.data.message },
            { status: error.response.status || 503 }
        );
    }
}

export async function POST(req, res) {
    const secretKey = req.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
        lessorId, // ID del lessor
        tipoInmueble,
        servicios,
        numRecamaras,
        numCamas,
        numBanos,
        numHuespedes,
        capEstacionamiento,
        fotos, // Array de fotos
        ubicacion, // Objeto con la ubicación
        titulo,
        descripcion,
        reglas, // Array de reglas
        precio,
        additionalFeatures
    } = await req.json();

    // Array para almacenar las URLs de las imágenes subidas
    const imageUrls = [];

    // Subir cada imagen
    try {
        for (const foto of fotos) {
            const imageUrl = await uploadImage(
                foto, // Asegúrate de que el path sea la ruta correcta de la imagen
                'properties', // Nombre de la carpeta en la que se va a almacenar los archivos
                {
                    transformation: [
                        { width: 800, height: 800, crop: "fill" },
                        { quality: "auto" },
                        { format: "webp" }
                    ]
                }
            );
            imageUrls.push(imageUrl); // Almacena la URL
        }
    } catch (error) {
        return NextResponse.json(
            { messages: "Error al subir las imágenes" },
            { status: 503 }
        );
    }
    // Take a look at the imageUrls array to upload the secure_url to the database
    const secureUrls = imageUrls.map(imageUrl => imageUrl.secure_url);

    // Preparar el objeto para enviar como JSON
    const propertyData = {
        lessorid: lessorId, // Cambiar por el ID del lessor actual
        propertytypeid: tipoInmueble,
        vchtitle: titulo,
        vchdescription: descripcion,
        bnavailability: false,
        intnumberrooms: numRecamaras,
        intnumberbeds: numCamas,
        intnumberbathrooms: numBanos,
        intmaxoccupancy: numHuespedes,
        objservices: {
            intAccountParking: capEstacionamiento,
            bnWaterIncluded: servicios.bnWaterIncluded,
            bnElectricityIncluded: servicios.bnElectricityIncluded,
            bnInternetIncluded: servicios.bnInternetIncluded,
            bnGasIncluded: servicios.bnGasIncluded,
            bnHeatingIncluded: servicios.bnHeatingIncluded,
            bnAirConditioningIncluded: servicios.bnAirConditioningIncluded,
            bnLaundryIncluded: servicios.bnLaundryIncluded,
            bnParkingIncluded: servicios.bnParkingIncluded,
            bnCleaningIncluded: servicios.bnCleaningIncluded,
            bnCableTVIncluded: servicios.bnCableTVIncluded,
            bnWashingMachineIncluded: servicios.bnWashingMachineIncluded,
            bnKitchen: servicios.bnKitchen,
            bnLivingRoom: servicios.bnLivingRoom,
            bnDiningRoom: servicios.bnDiningRoom,
            bnCoolerIncluded: servicios.bnCoolerIncluded,
            bnGardenIncluded: servicios.bnGardenIncluded,
            bnWashingArea: servicios.bnWashingArea,
        },
        objphotos: secureUrls, // Actualiza con las URLs de las imágenes
        objlocation: {
            street: ubicacion.calle,
            zip: ubicacion.codigoPostal,
            address: ubicacion.direccion,
            suburb: ubicacion.colonia,
            municipality: ubicacion.ciudad_municipio,
            state: ubicacion.estado,
            country: ubicacion.pais,
            num_ext: ubicacion.numExt,
            num_int: ubicacion.numInt,
            lat: ubicacion.latitud,
            lng: ubicacion.longitud,
        },
        decrentalcost: precio,
        vchpropertyrules: reglas,
        decpropertyrating: 1,
        vchbuildingsecurity: '',
        vchtransportationaccess: '',
        intmincontractduration: 1,
        intmaxcontractduration: 2,
        bnfurnished: false,
        vchfurnituretype: '',
        bnStudyZone: false,
        dtavailabilitydate: new Date().toISOString(),
        objaddition: {
            decarea: additionalFeatures.decarea, 
            fldistanceuniversity: additionalFeatures.fldistanceuniversity, 
            vchadditionalfeatures: additionalFeatures.vchadditionalfeatures,
            vchuniversity: additionalFeatures.vchuniversity,
        }
    };

    // Realizar la solicitud POST para guardar la información
    try {
        const response = await axios.post(`${process.env.REST_URL}/properties/`,
            propertyData,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REST_SECRET}`
                }
            });

        const statusMessageMap = {
            201: { message: 'Propiedad creada correctamente', data: response?.data },
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
        // Limpiar las imágenes subidas si es necesario
        const publicIds = imageUrls.map(imageUrl => imageUrl.public_id);
        publicIds.forEach(async publicId => {
            await deleteImage(publicId);
        });

        return NextResponse.json(
            { message: error.response.data.message },
            { status: error.response.status }
        );
    }
}
