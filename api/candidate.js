import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  if (req.method === 'POST') {
    const { roomId, role, candidate } = req.body;
    if (!roomId || !role || !candidate) return res.status(400).json({ error: 'Missing' });
    const roomExists = await redis.get(`room:${roomId}:meta`);
    if (!roomExists) return res.status(410).json({ error: 'Room expired or not found' });
    const key = `room:${roomId}:${role}:candidates`;
    await redis.rpush(key, JSON.stringify(candidate));
    await redis.expire(key, 60 * 30);
    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    const { roomId, role } = req.query;
    if (!roomId || !role) return res.status(400).json({ error: 'Missing' });
    const roomExists = await redis.get(`room:${roomId}:meta`);
    if (!roomExists) return res.status(410).json({ error: 'Room expired or not found' });
    const key = `room:${roomId}:${role}:candidates`;
    const arr = await redis.lrange(key, 0, -1) || [];
    if (arr.length) await redis.del(key); // remove after fetching
    const parsed = arr.map(a => JSON.parse(a));
    return res.json({ candidates: parsed });
  }

  res.status(405).json({ error: 'Method' });
}