// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { verifyCredentials, generateToken } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const isValid = verifyCredentials(email, password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(email);
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) { // Changed from 'error' to 'err' and using it
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
