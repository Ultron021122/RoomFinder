export { default } from "next-auth/middleware";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
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
export const config = {
  matcher: [
<<<<<<< HEAD
    "/arrendadores",
    //"/dashboard/:path*",
=======
    "/dashboard/:path*",
>>>>>>> 0d800f4daaf85d51cc24e502d4ec6469d29bdf79
    "/admin",
    "/user/:path*",
    //'/api/:path*',
  ],
};
