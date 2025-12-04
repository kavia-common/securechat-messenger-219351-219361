import { CONFIG } from '../config';
import { storage } from '../storage';
import type { IncomingSocketEvent, OutgoingSocketEvent } from '../types';

export type ChatEvent =
  | { type: 'connected' }
  | { type: 'disconnected' }
  | { type: 'error'; error: unknown }
  | { type: 'message'; chatId: string; message: IncomingSocketEvent extends { event: 'message'; message: infer M } ? M : never };

type Listener = (e: ChatEvent) => void;

class ChatSocket {
  private ws?: WebSocket;
  private listeners = new Set<Listener>();
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private manualClose = false;

  // PUBLIC_INTERFACE
  addListener(listener: Listener) {
    /** Add a listener for chat socket events */
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(e: ChatEvent) {
    this.listeners.forEach(l => l(e));
  }

  // PUBLIC_INTERFACE
  async connect() {
    /** Connect to chat websocket endpoint with auth token */
    this.manualClose = false;
    const token = await storage.getToken();
    const url = `${CONFIG.WS_URL}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.emit({ type: 'connected' });
    };
    this.ws.onclose = () => {
      this.emit({ type: 'disconnected' });
      if (!this.manualClose) {
        this.scheduleReconnect();
      }
    };
    this.ws.onerror = (err) => {
      this.emit({ type: 'error', error: err });
    };
    this.ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data as string) as IncomingSocketEvent;
        if (data?.event === 'message') {
          this.emit({ type: 'message', chatId: data.chatId, message: data.message });
        }
      } catch {
        // ignore invalid payloads
      }
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => void this.connect(), 1500);
  }

  // PUBLIC_INTERFACE
  async disconnect() {
    /** Disconnect websocket and prevent reconnect */
    this.manualClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
  }

  // PUBLIC_INTERFACE
  send(payload: OutgoingSocketEvent) {
    /** Send a message to the server via WS */
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }
}

export const chatSocket = new ChatSocket();
