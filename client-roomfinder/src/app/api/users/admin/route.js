import { NextResponse } from 'next/server';
import { deleteImage, uploadImage } from '../../cloudinary';
import axios from 'axios';


export async function POST(request, res) {
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
        vchemail,
        vchpassword,
        roleid,
        vchname,
        vchpaternalsurname,
        vchmaternalsurname,
        dtbirthdate,
        vchbiography,
        vchimage
    } = await request.json();

    let imageUrl;
    try {
        imageUrl = await uploadImage(
            vchimage,
            'users',
            {
                transformation: [
                    { width: 200, height: 200, crop: 'thumb' },
                    { quality: 'auto' },
                    { format: 'webp' }
                ]
            }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 503 }
        );
    }


    try {
        const response = await axios.post(`${process.env.REST_URL}/users`, {
            vchemail,
            vchpassword,
            roleid,
            vchname,
            vchpaternalsurname,
            vchmaternalsurname,
            dtbirthdate,
            vchbiography,
            vchimage: imageUrl.secure_url,
            bnstatus: true,
            bnverified: false
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        const statusMessageMap = {
            201: { message: 'Usuario creado', data: response.data },
            409: { message: 'Usuario ya existe' },
            400: { message: response.data.message },
            default: { message: 'Error al crear el usuario' },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message, data: response.data },
            { status: response.status }
        );


    } catch (error) {
        if (imageUrl && imageUrl.public_id) {
            await deleteImage(imageUrl.public_id);
        }
        return NextResponse.json(
            { message: 'Server error' },
            { status: 503 }
        );
    }
}