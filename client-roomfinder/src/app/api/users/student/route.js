import { NextResponse } from 'next/server';

export async function POST(req, res) {
    const { type_user, name, last_name, email, password, confirm_password, status, birthday, profileImage, code_student, university } = await req.json();
    return NextResponse.json(
        {
            message: "User created successfully!",
        },
        {
            status: 201,
        }
    );
}