import { NextResponse } from 'next/server';
import { deleteImage, uploadImage } from '../../cloudinary';
import axios from 'axios';

export async function GET() {
    try {
        const response = await axios.get(`${process.env.REST_URL}/students/`);
        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 503 }
        );
    }
}

export async function POST(req, res) {
    const { type_user, name, last_name, email, password, confirm_password, status, birthday, profileImage, code_student, university } = await req.json();
    let image;
    try {
        image = await uploadImage(
            profileImage,
            'students',
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
            { messages: "Server error" },
            { status: 503 }
        );
    }

    console.log(image)

    try {
        const response = await axios.post(`${process.env.REST_URL}/students/`, {
            type_user,
            name,
            last_name,
            email,
            password,
            birthday,
            status,
            image: image.secure_url,
            code_student,
            university,
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
            await deleteImage(image.public_id);
        }
        return NextResponse.json(
            { message: 'Server error'},
            { status: 503 }
        );
    }
}