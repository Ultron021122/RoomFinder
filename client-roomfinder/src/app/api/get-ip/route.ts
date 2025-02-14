import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for');
  return NextResponse.json({ ip: Array.isArray(ip) ? ip[0] : ip });
}