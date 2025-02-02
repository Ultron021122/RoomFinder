import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    try {
        const response = await axios.get(`${process.env.REST_URL}/lessors/`, {
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
            { message: error.message },
            { status: 503 }
        );
    }
}