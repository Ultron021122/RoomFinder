import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    const secretKey = req.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Obtener la ruta actual
    const pathname = req.nextUrl.pathname;
    const getValues = pathname.split('/');
    const token = getValues.pop();
    try {
        const response = await axios.get(`${process.env.REST_URL}/recovery/token/${token}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        return NextResponse.json(
            { data: response.data, message: 'Token válido' },
            { status: 200 }
        );
    } catch (error: any) {
        const statusMessageMap: Record<number, { message: string }> = {
            503: { message: 'Service unavailable' },
            404: { message: 'Usuario no encontrado' },
            400: { message: error.message },
            0: { message: 'Error inesperado' },
        };
        const message = statusMessageMap[error.response?.status] || statusMessageMap[0];
        return NextResponse.json(
            { message },
            { status: error.response?.status ? error.response.status as number : 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const token = pathname.split('/').pop();
    const { vchpassword, vchconfirm_password } = await req.json();

    try {
        const findUser = await axios.get(`${process.env.REST_URL}/recovery/token/${token}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        const usuarioid = findUser.data.usuarioid;
        const recuperacionid = findUser.data.recuperacionid;
        const response = await axios.patch(`${process.env.REST_URL}/users/${usuarioid}`, {
            vchpassword
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        const deleteToken = await axios.delete(`${process.env.REST_URL}/recovery/${recuperacionid}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        return NextResponse.json(
            { data: response.data, message: 'Contraseña actualizada' },
            { status: 200 }
        );

    } catch (error: any) {
        const statusMessageMap: Record<number, { message: string }> = {
            409: { message: 'El token ya esta utilizado' },
            400: { message: error.message },
            0: { message: 'Connection error' },
        };

        const message = statusMessageMap[error.response?.status] || statusMessageMap[0];
        return NextResponse.json(
            { message },
            { status: error.response?.status ? error.response.status as number : 500 }
        );
    }
}