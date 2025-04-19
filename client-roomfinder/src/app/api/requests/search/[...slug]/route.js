import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { slug } = params;
    const pathSegments = Array.isArray(slug) ? slug : [slug]

    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.REST_URL}/request/search/${pathSegments[0]}/${pathSegments[1]}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        const statusMessageMap = {
            200: { message: 'Solicitud encontrada' },
            404: { message: 'Solicitud no encontrada' },
            400: { message: response.data.message },
            default: { message: 'Error al buscar la solicitud' },
        };
        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message, data: response.data },
            { status: response.status }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error.response?.data.message || 'Server error' },
            { status: error.response?.status || 500 }
        );
    }
}