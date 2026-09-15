import { NextResponse, type NextRequest } from 'next/server';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['https://gym-hub-xp2v.vercel.app'];

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 100;

const ipHits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipHits.get(ip);

  if (!record || now > record.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > RATE_LIMIT_MAX_REQUESTS;
}

function getCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function middleware(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      { status: 429 }
    );
  }

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(req),
    });
  }

  const res = NextResponse.next();
  const corsHeaders = getCorsHeaders(req);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.headers.set(key, value);
  });

  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self';"
  );

  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
