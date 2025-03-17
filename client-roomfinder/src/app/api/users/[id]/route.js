import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
    const id = params.id;
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.REST_URL}/users/${id}`, {
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
            { message: 'Server error' },
            { status: error.response.status }
        );
    }
}

export async function DELETE(request, { params }) {
    const id = params.id;
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.delete(`${process.env.REST_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        const statusMessageMap = {
            200: { message: 'Usuario eliminado', data: response.data },
            404: { message: 'Usuario no encontrado' },
            400: { message: response.data.message },
            default: { message: 'Error al eliminar el usuario' },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message, data: response.data },
            { status: response.status }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: error.response.status }
        );
    }
}

export async function PATCH(request, { params }) {
    const id = params.id;
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
        vchname,
        vchpaternalsurname,
        vchmaternalsurname,
        dtbirthdate,
        bnstatus,
        bnverified,
        vchimage,
        vchcoverimage,
        vchbiography
    } = await request.json();

    try {
        const response = await axios.patch(`${process.env.REST_URL}/users/${id}`, {
            vchname,
            vchpaternalsurname,
            vchmaternalsurname,
            dtbirthdate,
            bnstatus,
            bnverified,
            vchimage,
            vchcoverimage,
            vchbiography
        }
            , {
                headers: {
                    Authorization: `Bearer ${process.env.REST_SECRET}`
                }
            });

        const statusMessageMap = {
            200: { message: 'Exitoso', data: response.data },
            400: { message: response.data.message },
            404: { message: response.data.message },
            default: { message: 'Error al actualizar informacion' },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message },
            { status: response.status },
            { data: response.data }
        );

    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : error.message;

        return NextResponse.json(
            { message: `Error updating request: ${message}` },
            { status }
        );
    }
}