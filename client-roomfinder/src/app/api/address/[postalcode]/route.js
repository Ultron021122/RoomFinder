import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const postalCode = params.postalcode;

    try {
        const data = await fetch(`${process.env.REST_URL}/utils/${postalCode}`, {
            headers: {
                "Authorization": `Bearer ${process.env.REST_SECRET}`
            }
        });
        const response = await data.json();

        return NextResponse.json(
            { message: 'Direcciones recuperadas', response },
            { status: response.status }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: error.response.status }
        );
    }
}