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
    const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, confirm_password, bnstatus, dtbirthdate, vchimage, roleid, intcodestudent, vchuniversity } = await req.json();
    let imageUrl;
    try {
        imageUrl = await uploadImage(
            vchimage,
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

    try {
        const response = await axios.post(`${process.env.REST_URL}/students/`, {
            vchname,
            vchpaternalsurname,
            vchmaternalsurname,
            vchemail,
            vchpassword,
            dtbirthdate,
            bnstatus,
            vchimage: imageUrl.secure_url,
            roleid,
            intcodestudent,
            vchuniversity,
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
        if (imageUrl && imageUrl.public_id) {
            await deleteImage(imageUrl.public_id);
        }
        return NextResponse.json(
            { message: 'Server error'},
            { status: 503 }
        );
    }
}