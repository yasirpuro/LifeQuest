export class RateLimiter {
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private timestamps: number[] = [];

  constructor(windowMs = 60_000, maxRequests = 5) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  allow(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(ts => now - ts < this.windowMs);
    if (this.timestamps.length >= this.maxRequests) return false;
    this.timestamps.push(now);
    return true;
  }
}

export const authRateLimiter = new RateLimiter();
