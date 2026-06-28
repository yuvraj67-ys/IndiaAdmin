import { NextResponse } from 'next/server';
import { createSessionCookie, clearSessionCookie } from '../../../lib/auth';

export async function POST(request) {
  const { password, action } = await request.json();

  if (action === 'logout') {
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', clearSessionCookie());
    return response;
  }

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', createSessionCookie());
    return response;
  }

  return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 });
}
