import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { createGymReview } from '@/services/gymService';
import { gymReviewSchema } from '@/schemas/review';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = requireAuth(req);
    const { id } = await context.params;
    const body = await req.json();
    const validated = gymReviewSchema.parse(body);

    const review = await createGymReview(session.id, id, validated);
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Invalid review data',
          },
        },
        { status: 400 }
      );
    }

    const message = error.message || 'Failed to submit review';
    const isConflict = message.includes('CONFLICT');
    const isNotFound = message.includes('NOT_FOUND');
    const isUnauthorized = message.includes('UNAUTHORIZED');

    const status = isUnauthorized ? 401 : isNotFound ? 404 : isConflict ? 409 : 400;

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isConflict ? 'CONFLICT' : isNotFound ? 'NOT_FOUND' : 'REVIEW_FAILED',
          message: message.replace(/^[A-Z_]+:\s*/, ''),
        },
      },
      { status }
    );
  }
}
