import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface RateLimitContext {
  remaining: number;
  reset: number;
  limit: number;
}

interface Options {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

type TokenBucket = number[];

export default class RateLimit {
  private tokenCache: Map<string, TokenBucket>;
  private uniqueTokenPerInterval: number;
  private interval: number;

  constructor(options?: Options) {
    this.tokenCache = new Map<string, TokenBucket>();
    this.uniqueTokenPerInterval = options?.uniqueTokenPerInterval || 500;
    this.interval = options?.interval || 60000; // default: 60 seconds
  }

  public async check(
    limit: number,
    token: string
  ): Promise<RateLimitContext> {
    const tokenCount = this.tokenCache.get(token) || [0];
    const now = Date.now();
    const windowStart = now - this.interval;

    tokenCount[0] = tokenCount.filter((timestamp: number) => timestamp > windowStart).length;

    if (tokenCount[0] >= limit) {
      const reset = Math.ceil((tokenCount[1] + this.interval - now) / 1000);
      return {
        remaining: 0,
        reset,
        limit,
      };
    }

    tokenCount.push(now);
    tokenCount[0] = tokenCount.length - 1;
    this.tokenCache.set(token, tokenCount);

    return {
      remaining: limit - tokenCount[0],
      reset: Math.ceil((now + this.interval - Date.now()) / 1000),
      limit,
    };
  }
}

const rateLimit = new RateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export async function withRateLimit(
  req: NextRequest,
  limit: number = 20
) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  try {
    const { remaining } = await rateLimit.check(limit, ip);
    
    if (remaining === 0) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }
    
    return null; // Continue with the request
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
