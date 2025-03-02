import { NextResponse } from 'next/server';
import { deleteImage, uploadImage } from '../../cloudinary';
import axios from 'axios';
import { COVER_IMAGE } from '@/utils/constants';

export async function PATCH(req, res) {
    const secretKey = req.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { usuarioid, image, type } = await req.json();
    let resultConsult;
    let imageUrl;

    try {
        resultConsult = await fetch(`${process.env.REST_URL}/users/images/${usuarioid}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        resultConsult = await resultConsult.json();

    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 503 }
        );
    }

    if (!resultConsult || !resultConsult.roleid) {
        return NextResponse.json(
            { message: 'Usuario no encontrado' },
            { status: 404 }
        );
    }

    let widthImage = type === COVER_IMAGE ? 1200 : 600;
    let heightImage = type === COVER_IMAGE ? 'auto' : 600;

    try {
        imageUrl = await uploadImage(
            image,
            resultConsult.roleid === 1 ? 'students' : 'lessors',
            {
                transformation: [
                    { width: widthImage, height: heightImage, crop: "fill" },
                    { quality: "auto" },
                    { format: "webp" }
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
        await deleteImage(type === COVER_IMAGE ? resultConsult.vchcoverimage : resultConsult.vchimage);
    } catch (error) {
        console.log('Error al eliminar la imagen', error);
        return NextResponse.json(
            { message: 'No  se pudo eliminar la imagen' },
            { status: 503 }
        );
    }

    try {
        const data = {
            [type === COVER_IMAGE ? "vchcoverimage" : "vchimage"]: imageUrl.secure_url
        }
        const response = await axios.patch(`${process.env.REST_URL}/users/${usuarioid}`, data, {
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
            { data: response.data }
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