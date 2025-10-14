import { useState, useEffect, useCallback } from 'react';

export function useApi() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch client configuration
  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we're in development or test mode
      const isDevelopment =
        import.meta.env.DEV ||
        import.meta.env.MODE === 'development' ||
        import.meta.env.MODE === 'test' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname.includes('localhost');

      console.log('Environment check:', {
        DEV: import.meta.env.DEV,
        MODE: import.meta.env.MODE,
        hostname: window.location.hostname,
        isDevelopment,
      });

      if (isDevelopment) {
        // Use mock configuration for development and testing
        console.log('Development mode: Using mock configuration');
        setConfig({
          authSecret: 'dev-mock-secret-key-123',
          environment: 'development',
          apiBase: '/api',
          features: {
            chat: true,
            diagnostics: true,
            recording: false,
          },
          rateLimits: {
            roomCreation: 50,
            chatMessages: 60,
            apiCalls: 2000,
          },
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/config');

      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.config) {
        console.log('Setting config:', data.config);
        setConfig(data.config);
      } else {
        throw new Error('Invalid config response format');
      }
    } catch (err) {
      console.error('Failed to fetch client configuration:', err);
      setError(err.message);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch config on mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Create room
  const createRoom = useCallback(async () => {
    try {
      // Check if we're in development or test mode
      const isDevelopment =
        import.meta.env.DEV ||
        import.meta.env.MODE === 'development' ||
        import.meta.env.MODE === 'test' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname.includes('localhost');

      if (isDevelopment) {
        // Mock room creation for development and testing
        console.log('Development mode: Mock room creation');
        return {
          success: true,
          roomId: 'dev-mock-room-' + Math.random().toString(36).substr(2, 9),
          message: 'Mock room created successfully',
        };
      }

      console.log('Creating room with config:', config);
      const headers = {
        'Content-Type': 'application/json',
        ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
      };
      console.log('Request headers:', headers);

      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'Unable to read error response';
        }
        console.error('Room creation failed:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          headers: response.headers ? Object.fromEntries(response.headers.entries()) : 'No headers',
        });
        throw new Error(
          `Failed to create room: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
        );
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error creating room:', err);
      throw err;
    }
  }, [config]);

  // Send chat message
  const sendChatMessage = useCallback(
    async (roomId, message, sender) => {
      try {
        // Check if we're in development or test mode
        const isDevelopment =
          import.meta.env.DEV ||
          import.meta.env.MODE === 'development' ||
          import.meta.env.MODE === 'test' ||
          window.location.hostname === 'localhost' ||
          window.location.hostname.includes('localhost');

        if (isDevelopment) {
          // Return mock response for development and testing
          return {
            ok: true,
            message: {
              id: Date.now().toString(),
              roomId,
              sender,
              message,
              timestamp: Date.now(),
            },
          };
        }

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
          },
          body: JSON.stringify({
            roomId,
            message,
            sender,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error sending chat message:', err);
        throw err;
      }
    },
    [config]
  );

  // Get chat messages
  const getChatMessages = useCallback(async (roomId, since = 0) => {
    try {
      // Check if we're in development or test mode
      const isDevelopment =
        import.meta.env.DEV ||
        import.meta.env.MODE === 'development' ||
        import.meta.env.MODE === 'test' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname.includes('localhost');

      if (isDevelopment) {
        // Return mock response for development and testing
        return {
          messages: [],
          success: true,
        };
      }

      const response = await fetch(`/api/chat?roomId=${roomId}&since=${since}`);

      if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting chat messages:', err);
      throw err;
    }
  }, []);

  // Send WebRTC offer
  const sendOffer = useCallback(
    async (roomId, offer) => {
      try {
        const response = await fetch('/api/offer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
          },
          body: JSON.stringify({
            roomId,
            desc: offer,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send offer: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error sending offer:', err);
        throw err;
      }
    },
    [config]
  );

  // Get WebRTC offer
  const getOffer = useCallback(async (roomId) => {
    try {
      const response = await fetch(`/api/offer?roomId=${roomId}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No offer available yet
        }
        throw new Error(`Failed to get offer: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting offer:', err);
      throw err;
    }
  }, []);

  // Send WebRTC answer
  const sendAnswer = useCallback(
    async (roomId, answer) => {
      try {
        const response = await fetch('/api/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
          },
          body: JSON.stringify({
            roomId,
            desc: answer,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send answer: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error sending answer:', err);
        throw err;
      }
    },
    [config]
  );

  // Get WebRTC answer
  const getAnswer = useCallback(async (roomId) => {
    try {
      const response = await fetch(`/api/answer?roomId=${roomId}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No answer available yet
        }
        throw new Error(`Failed to get answer: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting answer:', err);
      throw err;
    }
  }, []);

  // Send ICE candidate
  const sendICECandidate = useCallback(
    async (roomId, role, candidate) => {
      try {
        const response = await fetch('/api/candidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
          },
          body: JSON.stringify({
            roomId,
            role,
            candidate,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send ICE candidate: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error sending ICE candidate:', err);
        throw err;
      }
    },
    [config]
  );

  // Get ICE candidates
  const getICECandidates = useCallback(async (roomId, role) => {
    try {
      const response = await fetch(`/api/candidate?roomId=${roomId}&role=${role}`);

      if (!response.ok) {
        throw new Error(`Failed to get ICE candidates: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting ICE candidates:', err);
      throw err;
    }
  }, []);

  // Get diagnostics
  const getDiagnostics = useCallback(async (roomId, role) => {
    try {
      const response = await fetch(`/api/diagnostics?roomId=${roomId}&role=${role}`);

      if (!response.ok) {
        throw new Error(`Failed to get diagnostics: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting diagnostics:', err);
      throw err;
    }
  }, []);

  return {
    // State
    config,
    loading,
    error,

    // Actions
    fetchConfig,
    createRoom,
    sendChatMessage,
    getChatMessages,
    sendOffer,
    getOffer,
    sendAnswer,
    getAnswer,
    sendICECandidate,
    getICECandidates,
    getDiagnostics,
  };
}
