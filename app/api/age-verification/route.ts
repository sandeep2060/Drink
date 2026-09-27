import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  let decision: unknown;
  try {
    ({ decision } = await request.json());
  } catch {
    return NextResponse.json({ error: 'A valid age decision is required.' }, { status: 400 });
  }

  if (decision !== 'yes' && decision !== 'no') {
    return NextResponse.json({ error: 'A valid age decision is required.' }, { status: 400 });
  }

  const response = NextResponse.json({ accepted: decision === 'yes' });
  if (decision === 'yes') {
    response.cookies.set('drinkdrop_age', 'yes', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 180,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  } else {
    response.cookies.set('drinkdrop_age', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  return response;
}