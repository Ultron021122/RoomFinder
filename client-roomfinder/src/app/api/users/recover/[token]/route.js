import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET({ params }) {
    const token = params.token;
    try {
        const response = await axios.get(`${process.env.REST_URL}/recovery/token/${token}`);
        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );
    } catch (error) {
        console.log('error', error)
        const statusMessageMap = {
            503: { message: 'Service unavailable' },
            404: { message: 'Usuario no encontrado' },
            400: { message: error.message },
            default: { message: 'Error inesperado' },
        };
        const message = statusMessageMap[error.response.status] || statusMessageMap.default;
        if (error.response.status){
            return NextResponse.json(
                { message },
                { status: error.response.status }
            );
        } else {
            return NextResponse.json(
                { message },
                { status: 503 }
            );
        }
    }
}