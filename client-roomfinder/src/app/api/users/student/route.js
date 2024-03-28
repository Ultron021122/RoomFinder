import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

// Config cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


export async function POST(req, res) {
    const { type_user, name, last_name, email, password, confirm_password, status, birthday, profileImage, code_student, university } = await req.json();
    try {
        const uploadedResponse = await cloudinary.uploader.upload(profileImage, {
            folder: 'students',
        });

        if (uploadedResponse.secure_url) {
            const url = uploadedResponse.secure_url;
            console.log(url);
            // Almacenarla en la tabla fotos o imagenes o incluso editar la tabla usuario
        }
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
        return NextResponse.json(
            { message: "Bad Request" },
            { status: 400 }
        );
    }
}