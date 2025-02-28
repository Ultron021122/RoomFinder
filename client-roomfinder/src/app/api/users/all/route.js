import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.REST_URL}/users/`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        console.log(response.data)
        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}