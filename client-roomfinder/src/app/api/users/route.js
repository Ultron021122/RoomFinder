import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
    const { email, password } = await req.json();
    try {
        const response = await axios.post(`${process.env.REST_URL}/users/login`, {
            email,
            password,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        const statusMessageMap = {
            200: { message: 'Usuario logueado correctamente', data: response.data },
            401: { message: 'Credenciales inválidas' },
            400: { message: response.data.message },
            default: { message: 'Error al loguear el usuario' },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;

        return NextResponse.json(
            { message },
            { status: response.status }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 503 }
        );
    }
}