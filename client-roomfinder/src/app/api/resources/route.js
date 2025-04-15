import { NextResponse } from 'next/server';
import { deleteImage, uploadImage } from '../cloudinary';

export async function POST(request) {
    const { image, folder, width, height } = await request.json();
    try {
        let transformationOptions = [
            { width: width, crop: "scale" },
            { quality: "auto:best" },
            { fetch_format: "auto" }
        ];

        if (height) {
            transformationOptions[0].height = height;
        }

        const imageUrl = await uploadImage(
            image,
            folder,
            {
                transformation: transformationOptions
            }
        );

        return NextResponse.json(
            { message: "Image uploaded successfully", data: imageUrl},
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: error.response.status }
        );
    }
}