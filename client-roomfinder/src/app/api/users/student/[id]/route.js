import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
    const id = params.id;

    try {
        const response = await axios.get(`${process.env.REST_URL}/students/${id}`, {
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
            { message: 'Server error' },
            { status: 503 }
        );
    }
}


export async function PATCH(request, { params }) {
    const id = params.id;

    const {
        vchname,
        vchpaternalsurname,
        vchmaternalsurname,
        dtbirthdate,
        roleid,
        vchbiography,
        intcodestudent,
        vchuniversity,
        vchmajor
    } = await request.json();

    try {
        const response = await axios.patch(`${process.env.REST_URL}/students/${id}`, {
            vchname,
            vchpaternalsurname,
            vchmaternalsurname,
            dtbirthdate,
            roleid,
            vchbiography,
            intcodestudent,
            vchuniversity,
            vchmajor
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );

    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : error.message;

        return NextResponse.json(
            { message: `Error updating student: ${message}` },
            { status }
        );
    }
}