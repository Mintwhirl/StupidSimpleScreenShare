
import { Redis } from "@upstash/redis";
import { randomBytes } from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });

  const roomId = randomBytes(12).toString('hex'); // 24 hex chars, unguessable
  // create a marker key and set TTL (e.g., 30 minutes)
  await redis.set(`room:${roomId}:meta`, JSON.stringify({ createdAt: Date.now() }));
  await redis.expire(`room:${roomId}:meta`, 60 * 30);

  res.json({ roomId });
}
