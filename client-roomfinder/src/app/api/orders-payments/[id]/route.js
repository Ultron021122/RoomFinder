import axios from "axios";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    try {
        const response = await axios.patch(`${process.env.REST_URL}/payments-orders/${params.id}`, {
                status: status,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.REST_SECRET}`
                }
            });
        const statusMessageMap = {
            200: { message: 'Orden actualizada', data: response.data },
            404: { message: 'Orden no encontrada' },
            400: { message: response.data.message },
            default: { message: 'Error al actualizar' },
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