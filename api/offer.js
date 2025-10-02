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
    const { roomId, desc } = req.body;
    if (!roomId || !desc) return res.status(400).json({ error: 'Missing' });
    const roomExists = await redis.get(`room:${roomId}:meta`);
    if (!roomExists) return res.status(410).json({ error: 'Room expired or not found' });
    await redis.set(`room:${roomId}:offer`, JSON.stringify(desc));
    await redis.expire(`room:${roomId}:offer`, 60 * 30);
    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    const { roomId } = req.query;
    const roomExists = await redis.get(`room:${roomId}:meta`);
    if (!roomExists) return res.status(410).json({ error: 'Room expired or not found' });
    const raw = await redis.get(`room:${roomId}:offer`);
    if (!raw) return res.status(404).json({ error: 'no offer' });
    return res.json({ desc: JSON.parse(raw) });
  }

  res.status(405).json({ error: 'Method' });
}