export { default } from "next-auth/middleware";
import { NextRequest, NextResponse } from 'next/server';

/**
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware:', pathname)
  // Block access to /api routes
  if (pathname.startsWith('/api')) {
    console.log(request.headers)
    const internalHeader = request.headers.get('x-internal-request');
    console.log(internalHeader)
    console.log(process.env.INTERNAL_REQUEST_SECRET)
    if (internalHeader !== process.env.INTERNAL_REQUEST_SECRET) {
      console.log('Access denied')
      //return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
  }

  return NextResponse.next();
}
*/

export async function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for');
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin",
    "/user/:path*",
    "/checkout"
    //'/api/:path*',
  ],
};
