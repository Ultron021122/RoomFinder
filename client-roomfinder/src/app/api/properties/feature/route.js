import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.REST_URL}/properties/top/featured`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error?.response?.data.message },
            { status: error?.response?.status || 503 }
        );
    }
}