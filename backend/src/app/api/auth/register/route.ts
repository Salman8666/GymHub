import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/schemas/auth';
import { registerUser } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const result = await registerUser(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message:
              error.errors[0]?.message || 'Invalid form input',
          },
        },
        { status: 400 }
      );
    }

    const message = error.message || 'Registration failed';
    const isConflict = message.includes('USER_EXISTS');

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isConflict
            ? 'USER_EXISTS'
            : 'REGISTRATION_FAILED',
          message: message.replace(/^USER_EXISTS:\s*/, ''),
        },
      },
      { status: isConflict ? 409 : 400 }
    );
  }
}
