import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
    const id = params.id;
    try {
        const response = await axios.get(`${process.env.REST_URL}/users/images/${id}`);
        const statusMessageMap = {
            200: { message: 'Exito', data: response.data },
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
            { status: 503 }
        );
    }
}