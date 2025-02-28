import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
    const id = params.id;
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.REST_URL}/properties/owner/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        const statusMessageMap = {
            200: { message: 'Propiedad encontrada', data: response.data },
            404: { message: 'Propiedad no encontrada' },
            400: { message: response.data.message },
            default: { message: 'Error al buscar la propiedad' },
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
