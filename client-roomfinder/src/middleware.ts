import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import { User, useSessionStore } from "./components/sesion/global";

interface JWTPayload {
    id: number;
    type_user: string;
    name: string;
    last_name: string;
    email: string;
    password: string;
    birthday: string;
    status: "active" | "inactive";
    created_date: string;
}

export async function middleware(request: NextRequest) {
    const jwt = request.cookies.get('auth-user');
    if (!jwt) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
    try {
        const { payload } = await jwtVerify(
            jwt.value,
            new TextEncoder().encode(process.env.JWT_SECRET as string)
        ) as { payload: JWTPayload };

        const user: User = {
            ...payload,
        }
        console.log(user)
        useSessionStore.getState().login(user);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.next();
    }

}
export const config = {
    matcher: '/',
}