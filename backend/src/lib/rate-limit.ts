import { NextResponse, type NextRequest } from 'next/server';

type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

const DEFAULT_AUTH_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
};

class MemoryRateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();

  constructor(private config: RateLimitConfig) {}

  isLimited(key: string): boolean {
    const now = Date.now();
    const record = this.hits.get(key);

    if (!record || now > record.resetAt) {
      this.hits.set(key, { count: 1, resetAt: now + this.config.windowMs });
      return false;
    }

    record.count += 1;
    return record.count > this.config.maxRequests;
  }
}

const authLimiter = new MemoryRateLimiter(DEFAULT_AUTH_CONFIG);

function getClientIp(req: NextRequest | Request): string {
  const forwarded = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim();
  if (forwarded) return forwarded;
  return (req as any).ip ?? 'unknown';
}

export function rateLimitAuth(req: NextRequest | Request): NextResponse | null {
  const ip = getClientIp(req);
  const key = `auth:${ip}`;

  if (authLimiter.isLimited(key)) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many auth attempts. Please try again later.' } },
      { status: 429 }
    );
  }

  return null;
}
