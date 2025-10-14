import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';

// Mock the useApi hook
vi.mock('./hooks/useApi', () => ({
  useApi: () => ({
    config: {
      authSecret: 'test-secret',
      apiBase: '/api',
      features: { chat: true, diagnostics: true, viewerCount: true },
      rateLimits: { chat: 10, api: 100 },
    },
    loading: false,
    error: null,
    createRoom: vi.fn().mockResolvedValue({
      success: true,
      roomId: 'test-room-123',
      message: 'Room created successfully',
    }),
  }),
}));

// Mock the useWebRTC hook
vi.mock('./hooks/useWebRTC', () => ({
  useWebRTC: () => ({
    localStream: null,
    remoteStream: null,
    connectionState: 'disconnected',
    error: null,
    peerConnections: {},
    startScreenShare: vi.fn(),
    stopScreenShare: vi.fn(),
    connectToHost: vi.fn(),
    disconnect: vi.fn(),
    isConnected: false,
  }),
}));

// Mock the useChat hook
vi.mock('./hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    sendMessage: vi.fn(),
    loading: false,
    error: null,
  }),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main title', () => {
    render(<App />);
    expect(screen.getByText('STUPID-SIMPLE SCREEN SHARE')).toBeInTheDocument();
  });

  it('renders all main buttons', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /start sharing your screen to create a new room/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stop screen sharing and return to home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start recording the screen sharing session/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /toggle diagnostics panel to view connection information/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /join a room as a viewer to watch screen sharing/i })
    ).toBeInTheDocument();
  });

  it('renders the room ID input field', () => {
    render(<App />);

    const input = screen.getByLabelText(/enter room id to join/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Paste room id here');
  });

  it('renders preview sections', () => {
    render(<App />);

    expect(screen.getByText('Local preview')).toBeInTheDocument();
    expect(screen.getByText('Remote preview')).toBeInTheDocument();
    expect(screen.getByText('No remote connection')).toBeInTheDocument();
  });

  it('shows status as idle', () => {
    render(<App />);

    expect(screen.getByText('Status: idle')).toBeInTheDocument();
  });

  it('handles room ID input changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/enter room id to join/i);
    await user.type(input, 'test-room-123');

    expect(input).toHaveValue('test-room-123');
  });

  it('handles start sharing button click', async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole('button', { name: /start sharing your screen to create a new room/i });
    await user.click(button);

    // Should navigate to host view (the mock createRoom returns a roomId which triggers navigation)
    await waitFor(() => {
      expect(screen.getByText('Host View')).toBeInTheDocument();
    });
  });

  it('handles join room button click with valid room ID', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/enter room id to join/i);
    const button = screen.getByRole('button', { name: /join a room as a viewer to watch screen sharing/i });

    await user.type(input, 'test-room-123');
    await user.click(button);

    // Should navigate to viewer view
    await waitFor(() => {
      expect(screen.getByText('Viewer View')).toBeInTheDocument();
    });
  });

  it('shows alert when joining room without room ID', async () => {
    const user = userEvent.setup();
    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<App />);

    const button = screen.getByRole('button', { name: /join a room as a viewer to watch screen sharing/i });
    await user.click(button);

    expect(alertSpy).toHaveBeenCalledWith('Please enter a room ID');

    alertSpy.mockRestore();
  });

  it('handles stop sharing button click', async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole('button', { name: /stop screen sharing and return to home/i });
    await user.click(button);

    // Should stay on home view
    expect(screen.getByText('STUPID-SIMPLE SCREEN SHARE')).toBeInTheDocument();
  });

  it('handles start recording button click', async () => {
    const user = userEvent.setup();
    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<App />);

    const button = screen.getByRole('button', { name: /start recording the screen sharing session/i });
    await user.click(button);

    expect(alertSpy).toHaveBeenCalledWith('Recording functionality will be implemented soon!');

    alertSpy.mockRestore();
  });

  it('handles diagnostics button click', async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole('button', { name: /toggle diagnostics panel to view connection information/i });
    await user.click(button);

    // Should show diagnostics panel
    await waitFor(() => {
      expect(screen.getByText('Diagnostics')).toBeInTheDocument();
    });
  });

  it('has proper ARIA labels for accessibility', () => {
    render(<App />);

    expect(screen.getByLabelText(/start sharing your screen to create a new room/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stop screen sharing and return to home/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start recording the screen sharing session/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/toggle diagnostics panel to view connection information/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/join a room as a viewer to watch screen sharing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enter room id to join a screen sharing session/i)).toBeInTheDocument();
  });

  it('has proper focus states for buttons', () => {
    render(<App />);

    const startSharingButton = screen.getByRole('button', { name: /start sharing your screen to create a new room/i });
    const stopSharingButton = screen.getByRole('button', { name: /stop screen sharing and return to home/i });
    const joinRoomButton = screen.getByRole('button', { name: /join a room as a viewer to watch screen sharing/i });

    // Check that buttons have focus classes
    expect(startSharingButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-pink-400');
    expect(stopSharingButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-purple-400');
    expect(joinRoomButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-400');
  });
});
