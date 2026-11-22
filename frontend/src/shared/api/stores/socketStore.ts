import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SocketState {
  connected: boolean;
  reconnecting: boolean;
  reconnectAttempts: number;
  error: string | null;
}

interface SocketActions {
  connect: (token: string) => void;
  disconnect: () => void;
  emit: (event: string, data: unknown) => void;
  onEvent: (event: string, handler: (...args: any[]) => void) => void;
  offEvent: (event: string, handler: (...args: any[]) => void) => void;
}

type SocketStore = SocketState & SocketActions;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_RECONNECT_ATTEMPTS = 5;

// Exponential backoff delays: 1s, 2s, 4s, 8s, 16s
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000];

const SOCKET_URL = process.env.NEXT_PUBLIC_HOST_GATEWAY_API_URL || 'http://13.39.180.127:8080';

// ---------------------------------------------------------------------------
// Socket instance (module-level so it persists across renders)
// ---------------------------------------------------------------------------

let socket: Socket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSocketStore = create<SocketStore>((set, get) => ({
  // State
  connected: false,
  reconnecting: false,
  reconnectAttempts: 0,
  error: null,

  // Actions
  connect: (token: string) => {
    // If already connected, do nothing
    if (socket?.connected) return;

    // Clean up any existing socket
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }

    // Clear any pending reconnect timeout
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    // Reset state on fresh connect
    set({ error: null, reconnecting: false, reconnectAttempts: 0 });

    // Create Socket.IO client with JWT auth
    socket = io(SOCKET_URL, {
      path: '/socket.io/',
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: false, // We handle reconnection manually for exponential backoff
    });

    // --- Event handlers ---

    socket.on('connect', () => {
      set({
        connected: true,
        reconnecting: false,
        reconnectAttempts: 0,
        error: null,
      });
    });

    socket.on('disconnect', (reason) => {
      set({ connected: false });

      // If the server deliberately disconnected us (e.g., auth failure), don't reconnect
      if (reason === 'io server disconnect') {
        return;
      }

      // Otherwise, attempt reconnection with exponential backoff
      attemptReconnect(token, set, get);
    });

    socket.on('connect_error', (err) => {
      const isAuthError =
        err.message?.toLowerCase().includes('unauthorized') ||
        err.message?.toLowerCase().includes('authentication') ||
        err.message?.toLowerCase().includes('jwt') ||
        err.message?.toLowerCase().includes('token');

      if (isAuthError) {
        set({
          connected: false,
          reconnecting: false,
          error: 'Session expired',
        });
        return;
      }

      // Attempt reconnection for non-auth errors
      set({ connected: false });
      attemptReconnect(token, set, get);
    });

    socket.on('error', (data: { message?: string }) => {
      set({ error: data?.message || 'An error occurred' });
    });
  },

  disconnect: () => {
    // Clear reconnect timeout
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    // Disconnect and clean up socket
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }

    // Reset all state
    set({
      connected: false,
      reconnecting: false,
      reconnectAttempts: 0,
      error: null,
    });
  },

  emit: (event: string, data: unknown) => {
    if (socket?.connected) {
      socket.emit(event, data);
    }
  },

  onEvent: (event: string, handler: (...args: any[]) => void) => {
    socket?.on(event, handler);
  },

  offEvent: (event: string, handler: (...args: any[]) => void) => {
    socket?.off(event, handler);
  },
}));

// ---------------------------------------------------------------------------
// Reconnection logic (exponential backoff)
// ---------------------------------------------------------------------------

function attemptReconnect(
  token: string,
  set: (partial: Partial<SocketState>) => void,
  get: () => SocketStore
) {
  const { reconnectAttempts } = get();

  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    set({
      reconnecting: false,
      error: 'Unable to connect. Please try reconnecting manually.',
    });
    return;
  }

  const nextAttempt = reconnectAttempts + 1;
  const delay = RECONNECT_DELAYS[reconnectAttempts] || RECONNECT_DELAYS[RECONNECT_DELAYS.length - 1];

  set({
    reconnecting: true,
    reconnectAttempts: nextAttempt,
  });

  reconnectTimeout = setTimeout(() => {
    if (socket) {
      socket.auth = { token };
      socket.connect();
    }
  }, delay);
}
