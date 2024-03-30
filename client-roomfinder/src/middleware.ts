import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import { User, useSessionStore } from "./components/sesion/global";

interface JWTPayload {
    id: number;
    email: string;
    type_user: string;
}

export async function middleware(request: NextRequest) {
    const jwt = request.cookies.get('login');
    if (!jwt) {
        return NextResponse.redirect(new URL('/sesion', request.nextUrl));
    }
    try {
        const { payload } = await jwtVerify(
            jwt.value,
            new TextEncoder().encode(process.env.JWT_SECRET as string)
        ) as { payload: JWTPayload };

        const user: Partial<User> = {
            id: payload.id,
            email: payload.email,
            type_user: payload.type_user,
        }

        // useSessionStore.getState().login(user);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.next();
    }

}
export const config = {
    matcher: '/',
}