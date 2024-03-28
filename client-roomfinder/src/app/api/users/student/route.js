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
            { message: error.message },
            { status: 400 }
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
            { messages: "Error al subir la imagen" },
            { status: 500 }
        );
    }

    try {
        const response = await axios.post(`${process.env.REST_URL}/students/`, {
            type_user,
            name,
            last_name,
            email,
            password,
            confirm_password,
            status,
            birthday,
            code_student,
            university,
        });
        if (response.status === 201) {
            return NextResponse.json(
                { message: "Usuario creado con éxito", data: response.data },
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                { message: "Error al crear el usuario" },
                { status: 500 }
            );
        }
    } catch (error) {
        if (image && image.public_id) {
            const deleteImage = await deleteImage(image.public_id);
            console.log(deleteImage);
        }
        return NextResponse.json(
            { message: error.message },
            { status: 400 }
        );
    }
}