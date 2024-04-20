import { NextResponse } from 'next/server';
import { deleteImage, uploadImage } from '../cloudinary';

export async function POST(request) {
    const { image } = await request.json();
    let imageUrl;
    try {
        imageUrl = await uploadImage(
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
        console.log(imageUrl)
        return NextResponse.json(
            { message: "Image uploaded successfully", imageUrl: imageUrl.secure_url },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 503 }
        );
    }
}