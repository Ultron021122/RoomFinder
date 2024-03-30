import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export async function uploadImage(image, folder, transformationOptions = {}) {
    try {
        const response = await cloudinary.uploader.upload(image, {
            folder: folder,
            ...transformationOptions
        });
        return response;
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 503 }
        );
    }
}

export async function deleteImage(public_id) {
    try {
        const response = await cloudinary.uploader.destroy(public_id);
        return response;
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 503 }
        );
    }
}