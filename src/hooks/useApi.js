import { useState, useEffect, useCallback } from 'react';

export function useApi() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simple config for Pusher-based app
  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simple configuration for our MVP
      setConfig({
        environment: 'production',
        apiBase: '/api',
        features: {
          diagnostics: true,
        },
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch configuration:', err);
      setError(err.message);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create room function (no longer needed for Pusher)
  const createRoom = useCallback(async () => {
    // Not needed with Pusher channels
    return { success: true, roomId: 'shared' };
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, createRoom, refetch: fetchConfig };
}
