import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
    const id = params.id;
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.REST_URL}/lessors/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        const statusMessageMap = {
            200: { message: 'Usuario encontrado', data: response.data },
            404: { message: 'Usuario no encontrado' },
            400: { message: response.data.message },
            default: { message: 'Error al buscar el usuario' },
        };
        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message, data: response.data },
            { status: response.status }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server Error' },
            { status: error.response.status }
        );
    }
}


export async function PATCH(request, { params }) {
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const {
        vchname,
        vchpaternalsurname,
        vchmaternalsurname,
        dtbirthdate,
        roleid,
        vchbiography,
        vchphone,
        vchstreet,
        intzip,
        vchsuburb,
        vchmunicipality,
        vchstate
    } = await request.json();

    try {
        const response = await axios.patch(`${process.env.REST_URL}/lessors/${id}`, {
            vchname,
            vchpaternalsurname,
            vchmaternalsurname,
            dtbirthdate,
            roleid,
            vchbiography,
            vchphone,
            vchstreet,
            intzip: parseInt(intzip),
            vchsuburb,
            vchmunicipality,
            vchstate
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );

    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : error.message;

        return NextResponse.json(
            { message: `Error updating user lessor: ${message}` },
            { status }
        );
    }
}