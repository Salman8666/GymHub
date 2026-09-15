import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { getUserById } from '@/services/authService';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    const user = await getUserById(payload.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'User not found' } },
        { status: 404 }
      );
    }

    const { passwordHash, ...sanitizedUser } = user;

    return NextResponse.json(
      { success: true, data: sanitizedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: 'Unauthorized' } },
      { status: 401 }
    );
  }
}
