// Health check endpoint for Vercel
export const config = {
  runtime: 'edge',
};

export default async function handler() {
  // Check if API functions are reachable
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  };

  return new Response(JSON.stringify(healthData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
