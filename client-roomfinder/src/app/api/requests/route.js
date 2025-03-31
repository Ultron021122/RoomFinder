import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.REST_URL}/request`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        const statusMessageMap = {
            200: { message: 'Solicitud encontrada', data: response.data },
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
            { message: 'Server error' },
            { status: error.response.status }
        );
    }
}


export async function POST(req, res) {
    const secretKey = req.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
        propertyid,
        studentid,
        statusid,
        vchmessage,
        intnumguests,
        bnhaspets,
        dtstartdate,
        dtenddate
    } = await req.json();

    try {
        const response = await axios.post(`${process.env.REST_URL}/request`, {
            propertyid,
            studentid,
            statusid,
            vchmessage,
            intnumguests,
            bnhaspets,
            dtstartdate,
            dtenddate
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        const statusMessageMap = {
            201: { message: 'Solicitud creada correctamente', data: response.data },
            409: { message: 'La solicitud ya fue creada' },
            503: { message: 'Error al crear la solicitud' },
            default: { message: response.data.message },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message },
            { status: response.status }
        );

    } catch(error) {
        return NextResponse.json(
            { message: error.response.data.message },
            { status: error.response.status || 503 }
        );
    }
}