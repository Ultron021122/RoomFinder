import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    // Obtener la ruta actual
    const pathname = req.nextUrl.pathname;
    const getValues = pathname.split('/');
    const token = getValues.pop();
    const usuarioid = getValues[getValues.length - 1];
    try {
        const response = await axios.get(`${process.env.REST_URL}/users/verify/${usuarioid}/${token}`);
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