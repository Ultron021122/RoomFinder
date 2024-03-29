import { NextResponse } from 'next/server';

export async function POST(req, res) {
    const { email, password } = await req.json();
    return NextResponse.json(
        { message: 'Usuario creado correctamente' },
        { status: 200 }
    );
}