import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
    const id = params.id;

    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const response = await axios.get(`${process.env.PREDIC_URL}/recommend/${id}`);

        const propertyConsult = {
            idU: response.data.recommendations[0].recommended_property_id,
            idD: response.data.recommendations[1].recommended_property_id,
            idT: response.data.recommendations[2].recommended_property_id
        }

        const responseProperties = await axios.post(`${process.env.REST_URL}/properties/predict`,
            propertyConsult,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REST_SECRET}`
                }
            });

        return NextResponse.json(
            { data: responseProperties.data },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: error.response.status }
        );
    }
}