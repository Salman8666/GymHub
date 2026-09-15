import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/schemas/auth';
import { loginUser } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);
    const result = await loginUser(validatedData);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Invalid credentials format',
          },
        },
        { status: 400 }
      );
    }

    const message = error.message || 'Invalid credentials';
    const isUnauthorized = message.includes('INVALID_CREDENTIALS');

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: message.replace(/^INVALID_CREDENTIALS:\s*/, ''),
        },
      },
      { status: isUnauthorized ? 401 : 400 }
    );
  }
}
