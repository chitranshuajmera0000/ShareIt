import { Hono } from 'hono';
import { decode, sign, verify } from 'hono/jwt';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';

// Define the environment bindings for Hono
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    header: string;
    RESEND_API_KEY:string;
  };
}>();

// Leaky Bucket Rate Limiter Configuration
const BUCKET_CAPACITY = 100; // Max requests allowed in the bucket
const LEAK_RATE = 10; // Requests leaked per second (e.g., 10 requests/second)
const buckets: Map<string, { count: number; lastLeak: number }> = new Map();

// Function to update the bucket (leak water and add new request)
function updateBucket(identifier: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(identifier) || { count: 0, lastLeak: now };

  // Calculate time elapsed since last leak (in seconds)
  const elapsedTime = (now - bucket.lastLeak) / 1000;
  // Leak requests based on elapsed time
  const leaked = Math.floor(elapsedTime * LEAK_RATE);
  // Update bucket count, ensuring it doesn't go below 0
  bucket.count = Math.max(0, bucket.count - leaked);

  // Update last leak timestamp
  bucket.lastLeak = now;

  // Check if adding a new request exceeds capacity
  if (bucket.count >= BUCKET_CAPACITY) {
    buckets.set(identifier, bucket);
    return false; // Rate limit exceeded
  }

  // Add the new request
  bucket.count += 1;
  buckets.set(identifier, bucket);
  return true; // Request allowed
}

// Rate Limiting Middleware
app.use('*', async (c, next) => {
  const clientIp = c.req.header('X-Forwarded-For') || c.req.header('CF-Connecting-IP') || 'unknown-ip';
  const referer = c.req.header('Referer') || '';

  // Bypass rate limiting if the request comes from Cloudflare Worker
  if (referer.includes('your-worker-name.workers.dev')) {
    await next();
    return;
  }

  const isAllowed = updateBucket(clientIp);
  if (!isAllowed) {
    return c.json(
      { error: 'Rate limit exceeded', message: `Limit of ${BUCKET_CAPACITY} requests reached.` },
      429
    );
  }

  await next();
});


// CORS Configuration
app.use(
  cors({
    origin: 'https://share-it-nine.vercel.app/', // Allows all origins; you can specify allowed origins here
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);


// Define routes
app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

export default app;
