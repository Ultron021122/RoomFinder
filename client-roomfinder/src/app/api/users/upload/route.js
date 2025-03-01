import { NextResponse } from 'next/server';
import { uploadImage } from '../../cloudinary';
import axios from 'axios';
import { COVER_IMAGE } from '@/utils/constants';

export async function PATCH(req, res) {
    const secretKey = req.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { usuarioid, image, type } = await req.json();
    let imageUrl;
    try {
        imageUrl = await uploadImage(
            image,
            'users',
            {
                transformation: [
                    { width: 1200, height: 1000, crop: "fill" },
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
    if (!imageUrl) {
        return NextResponse.json(
            { message: 'Error al subir imagen' },
            { status: 503 }
        );
    }
    try {
        const data = {
            [type === COVER_IMAGE ? "vchcoverimage" : "vchimage"] : imageUrl.secure_url
        }
        const response = await axios.patch(`${process.env.REST_URL}/users/${usuarioid}`, data , {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        const statusMessageMap = {
            200: { message: 'Exitoso', data: response.data },
            400: { message: response.data.message },
            404: { message: response.data.message },
            default: { message: 'Error al subir imagen' },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message },
            { status: response.status },
            { data: response.data}
        );

    } catch (error) {
        if (imageUrl && imageUrl.public_id) {
            await deleteImage(imageUrl.public_id);
        }

        const statusMessageMap = {
            400: { message: error?.statusText },
            404: { message: error?.statusText },
            503: { message: 'Error en el servidor' },
            default: { message: 'Error al subir imagen' },
        };

        const message = statusMessageMap[error?.status] || statusMessageMap.default;
        return NextResponse.json(
            { message },
            { status: error.status }
        );
    }
}