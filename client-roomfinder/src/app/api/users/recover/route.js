import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req, res) {
    const { vchemail } = await req.json();
    console.log("-----------------")
    try {
        const response = await axios.post(`${process.env.REST_URL}/users/forgot`, {
            vchemail,
        });
        console.log(response.data);
        return NextResponse.json(
            { message: "Correo enviado correctamente" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 503 }
        );
    }
}