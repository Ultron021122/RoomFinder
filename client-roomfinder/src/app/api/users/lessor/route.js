import { NextResponse } from 'next/server';
import { deleteImage, uploadImage } from '../../cloudinary';
import axios from 'axios';

export async function GET() {
    try {
        const response = await axios.get(`${process.env.REST_URL}/lessors/`);
        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 400 }
        );
    }
}

export async function POST(req, res) {
    const { type_user, name, last_name, email, password, confirm_password, status, birthday, profileImage, phone, street, zip, suburb, municipality, state } = await req.json();
    let image;
    try {
        image = await uploadImage(
            profileImage,
            'lessors',
            {
                transformation: [
                    { width: 600, height: 600, crop: "fill" },
                    { quality: "auto" },
                    { format: "jpg" }
                ]
            }
        );
    } catch (error) {
        return NextResponse.json(
            { messages: "Error al subir la imagen" },
            { status: 500 }
        );
    }

    try {
        const response = await axios.post(`${process.env.REST_URL}/lessors/`, {
            type_user,
            name,
            last_name,
            email,
            password,
            confirm_password,
            status,
            birthday,
            phone,
            street,
            zip,
            suburb,
            municipality,
            state
        });
        
        const statusMessageMap = {
            201: { message: 'Estudiante creado correctamente', data: response.data },
            409: { message: 'El correo ya está registrado' },
            400: { message: response.data.message },
            default: { message: 'Error al crear el estudiante' },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message },
            { status: response.status }
        );

    } catch (error) {
        if (image && image.public_id) {
            const deleteResult = await deleteImage(image.public_id);
        }
        return NextResponse.json(
            { message: error.message },
            { status: 503 }
        );
    }
}