import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useApi } from './useApi';

// Mock fetch globally
global.fetch = vi.fn();

describe('useApi Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    delete import.meta.env.DEV;
    delete import.meta.env.MODE;
    // Mock window.location.hostname to avoid localhost detection
    Object.defineProperty(window, 'location', {
      value: { hostname: 'example.com' },
      writable: true,
    });
  });

  describe('fetchConfig', () => {
    it('should fetch config successfully in production', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      const mockConfig = {
        success: true,
        config: {
          authSecret: 'test-secret',
          apiBase: '/api',
          features: { chat: true, diagnostics: true, recording: false },
          rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockConfig),
      });

      const { result } = renderHook(() => useApi());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.config).toEqual(mockConfig.config);
      expect(result.current.error).toBe(null);
    });

    it('should use mock config in development mode', async () => {
      // Mock development environment
      import.meta.env.DEV = true;

      const { result } = renderHook(() => useApi());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.config).toEqual({
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
      expect(result.current.error).toBe(null);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle config fetch error', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useApi());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.config).toBe(null);
      expect(result.current.error).toBe('Network error');
    });

    it('should handle non-ok response', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { result } = renderHook(() => useApi());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.config).toBe(null);
      expect(result.current.error).toBe('Failed to fetch config: 500');
    });
  });

  describe('createRoom', () => {
    it('should create room successfully in production', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      const mockConfig = {
        success: true,
        config: {
          authSecret: 'test-secret',
          apiBase: '/api',
          features: { chat: true, diagnostics: true, recording: false },
          rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
        },
      };

      const mockResponse = {
        success: true,
        roomId: 'test-room-123',
        message: 'Room created successfully',
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockConfig),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        });

      const { result } = renderHook(() => useApi());

      // Wait for config to load
      await waitFor(() => {
        expect(result.current.config).toBeTruthy();
      });

      const roomData = await result.current.createRoom();

      expect(roomData).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-secret': 'test-secret',
        },
      });
    });

    it('should use mock room creation in development', async () => {
      import.meta.env.DEV = true;

      const { result } = renderHook(() => useApi());

      // Wait for config to load
      await waitFor(() => {
        expect(result.current.config).toBeTruthy();
      });

      const roomData = await result.current.createRoom();

      expect(roomData.success).toBe(true);
      expect(roomData.roomId).toMatch(/^dev-mock-room-/);
      expect(roomData.message).toBe('Mock room created successfully');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle create room error', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      const mockConfig = {
        success: true,
        config: {
          authSecret: 'test-secret',
          apiBase: '/api',
          features: { chat: true, diagnostics: true, recording: false },
          rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
        },
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockConfig),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        });

      const { result } = renderHook(() => useApi());

      // Wait for config to load
      await waitFor(() => {
        expect(result.current.config).toBeTruthy();
      });

      await expect(result.current.createRoom()).rejects.toThrow('Failed to create room: 401');
    });
  });

  describe('sendChatMessage', () => {
    it('should send chat message successfully in production', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      const mockConfig = {
        success: true,
        config: {
          authSecret: 'test-secret',
          apiBase: '/api',
          features: { chat: true, diagnostics: true, recording: false },
          rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
        },
      };

      const mockResponse = {
        success: true,
        message: 'Message sent successfully',
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockConfig),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        });

      const { result } = renderHook(() => useApi());

      // Wait for config to load
      await waitFor(() => {
        expect(result.current.config).toBeTruthy();
      });

      const response = await result.current.sendChatMessage('room-123', 'Hello world', 'user1');

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-secret': 'test-secret',
        },
        body: JSON.stringify({
          roomId: 'room-123',
          message: 'Hello world',
          sender: 'user1',
        }),
      });
    });

    it('should use mock response in development mode', async () => {
      import.meta.env.DEV = true;

      const { result } = renderHook(() => useApi());

      // Wait for config to load
      await waitFor(() => {
        expect(result.current.config).toBeTruthy();
      });

      const response = await result.current.sendChatMessage('room-123', 'Hello world', 'user1');

      expect(response.ok).toBe(true);
      expect(response.message.id).toBeDefined();
      expect(response.message.roomId).toBe('room-123');
      expect(response.message.sender).toBe('user1');
      expect(response.message.message).toBe('Hello world');
      expect(response.message.timestamp).toBeDefined();
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('getChatMessages', () => {
    it('should get chat messages successfully in production', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      const mockMessages = [
        { id: 1, message: 'Hello', sender: 'user1', timestamp: Date.now() },
        { id: 2, message: 'Hi there', sender: 'user2', timestamp: Date.now() },
      ];

      // Mock the config fetch first, then the chat messages fetch
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              config: {
                authSecret: 'test-secret',
                apiBase: '/api',
                features: { chat: true, diagnostics: true, recording: false },
                rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
              },
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, messages: mockMessages }),
        });

      const { result } = renderHook(() => useApi());

      // Wait for config to load
      await waitFor(() => {
        expect(result.current.config).toBeTruthy();
      });

      const response = await result.current.getChatMessages('room-123', 0);

      expect(response).toEqual({ success: true, messages: mockMessages });
      expect(fetch).toHaveBeenCalledWith('/api/chat?roomId=room-123&since=0');
    });

    it('should use mock response in development mode', async () => {
      import.meta.env.DEV = true;

      const { result } = renderHook(() => useApi());

      const response = await result.current.getChatMessages('room-123', 0);

      expect(response).toEqual({
        messages: [],
        success: true,
      });
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('WebRTC methods', () => {
    it('should send offer successfully', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      const mockConfig = {
        success: true,
        config: {
          authSecret: 'test-secret',
          apiBase: '/api',
          features: { chat: true, diagnostics: true, recording: false },
          rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
        },
      };

      const mockOffer = { type: 'offer', sdp: 'test-sdp' };
      const mockResponse = { success: true };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockConfig),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        });

      const { result } = renderHook(() => useApi());

      // Wait for config to load
      await waitFor(() => {
        expect(result.current.config).toBeTruthy();
      });

      const response = await result.current.sendOffer('room-123', mockOffer);

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-secret': 'test-secret',
        },
        body: JSON.stringify({
          roomId: 'room-123',
          desc: mockOffer,
        }),
      });
    });

    it('should get offer successfully', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      const mockOffer = { type: 'offer', sdp: 'test-sdp' };

      // Mock the config fetch first, then the offer fetch
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              config: {
                authSecret: 'test-secret',
                apiBase: '/api',
                features: { chat: true, diagnostics: true, recording: false },
                rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
              },
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, desc: mockOffer }),
        });

      const { result } = renderHook(() => useApi());

      // Wait for config to load
      await waitFor(() => {
        expect(result.current.config).toBeTruthy();
      });

      const response = await result.current.getOffer('room-123');

      expect(response).toEqual({ success: true, desc: mockOffer });
      expect(fetch).toHaveBeenCalledWith('/api/offer?roomId=room-123');
    });

    it('should handle 404 when getting offer', async () => {
      // Force production mode
      import.meta.env.DEV = false;
      import.meta.env.MODE = 'production';
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true,
      });

      // Mock the config fetch first, then the 404 offer fetch
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              config: {
                authSecret: 'test-secret',
                apiBase: '/api',
                features: { chat: true, diagnostics: true, recording: false },
                rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
              },
            }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

      const { result } = renderHook(() => useApi());

      // Wait for config to load
      await waitFor(() => {
        expect(result.current.config).toBeTruthy();
      });

      const response = await result.current.getOffer('room-123');

      expect(response).toBe(null);
    });
  });
});
