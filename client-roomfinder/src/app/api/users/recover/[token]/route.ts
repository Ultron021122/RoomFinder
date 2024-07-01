import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    // Obtener la ruta actual
    const pathname = req.nextUrl.pathname;
    const getValues = pathname.split('/');
    const token = getValues.pop();
    try {
        const response = await axios.get(`${process.env.REST_URL}/recovery/token/${token}`);
        return NextResponse.json(
            { data: response.data },
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
            { status: error.response?.status ? error.response.status as number : 500}
        );
    }
}

export async function POST(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const token = pathname.split('/').pop();
    const { vchpassword, vchconfirm_password } = await req.json();

    try {
        const findUser = await axios.get(`${process.env.REST_URL}/recovery/token/${token}`);
        const usuarioid = findUser
        const response = await axios.post(`${process.env.REST_URL}/users/${usuarioid}`, {
            vchpassword
        });
        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );

    } catch (error: any) {
        const statusMessageMap: Record<number, { message: string }> = {
            409: { message: 'El correo ya está registrado' },
            400: { message: error.message },
            0: { message: 'Connection error' },
        };

        const message = statusMessageMap[error.response?.status] || statusMessageMap[0];
        return NextResponse.json(
            { message },
            { status: error.response?.status ? error.response.status as number : 500}
        );
    }
}