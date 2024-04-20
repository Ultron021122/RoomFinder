import { NextResponse } from 'next/server';
import { deleteImage, uploadImage } from '../cloudinary';

export async function POST(request) {
    const { image } = await request.json();
    try {
        const imageUrl = await uploadImage(
            image,
            'resources',
            {
                transformation: [
                    { width: 1800, crop: "scale" },
                    { quality: "auto" },
                    { fetch_format: "auto" }
                ]
            }
        );
        return NextResponse.json(
            { message: "Image uploaded successfully" },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 503 }
        );
    }
}