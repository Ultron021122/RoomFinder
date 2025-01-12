import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req, res) {
    const { usuario1id, usuario2id } = await req.json();

    try {
        const response = await axios.post(`${process.env.REST_URL}/chats/`, {
            usuario1id,
            usuario2id,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        //console.log('chats:', response.data);
        return NextResponse.json(
            { message: 'Chat creado correctamente', data: response.data },
            { status: response.status }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Server error'},
            { status: error.response.status }
        );
    }
}