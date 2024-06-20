import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
    const token = params.token;
    try {
        const response = await axios.get(`${process.env.REST_URL}/recovery/token/${token}`);
        return NextResponse.json(
            { message: 'Usuario encontrado', data: response.data },
            { status: response.status }
        );
    } catch (error) {
        const statusMessageMap = {
            503: { message: 'Service unavailable' },
            404: { message: 'Usuario no encontrado' },
            400: { message: error.response.data.message },
            default: { message: 'Error inesperado' },
        };
        const message = statusMessageMap[error.status] || statusMessageMap.default;
        console.log(message);
        return NextResponse.json(
            { message },
            { status: error.status }
        );
    }
}