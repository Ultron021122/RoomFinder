import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import axios from 'axios';

export async function POST(req, res) {
    const { email, password } = await req.json();
    try {
        const response = await axios.post(`${process.env.REST_URL}/users/login`, {
            email,
            password,
        });

        const statusMessageMap = {
            200: { message: 'Usuario logueado correctamente', data: response.data },
            401: { message: 'Credenciales inválidas' },
            400: { message: response.data.message },
            default: { message: 'Error al loguear el usuario' },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;

        if (response.status === 200) {
            const token = sign({
                exp: Math.floor(Date.now() / 1000) + 86400, // 1 day
                id: response.data.id,
                type_user: response.data.type_user,
                name: response.data.name,
                last_name: response.data.last_name,
                email: response.data.email,
                password: response.data.password,
                birth_date: response.data.birth_date,
                status: response.data.status,
                created_date: response.data.created_date,
            }, process.env.JWT_SECRET);

            const respuesta = NextResponse.json({
                message,
                token,
                status: response.status
            });

            respuesta.cookies.set({
                name: 'auth-user',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400, // 1 day
                path: '/',
            });

            return respuesta;
        }
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