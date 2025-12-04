import { CONFIG } from '../config';
import { storage } from '../storage';
import type { Message } from '../types';
import * as signalR from '@microsoft/signalr';

export type ChatEvent =
  | { type: 'connected' }
  | { type: 'disconnected' }
  | { type: 'error'; error: unknown }
  | { type: 'message'; chatId: string; message: Message };

type Listener = (e: ChatEvent) => void;

class ChatSocket {
  private conn?: signalR.HubConnection;
  private listeners = new Set<Listener>();
  private reconnecting = false;

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
    /** Connect to SignalR chat hub with auth token */
    if (this.conn && (this.conn.state === signalR.HubConnectionState.Connected || this.conn.state === signalR.HubConnectionState.Connecting)) {
      return;
    }
    const url = CONFIG.WS_URL; // ws://localhost:3001/ws/chat
    this.conn = new signalR.HubConnectionBuilder()
      .withUrl(url.replace(/^ws/, 'http'), {
        accessTokenFactory: async () => (await storage.getToken()) || '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.conn.onclose((_err) => {
      this.emit({ type: 'disconnected' });
    });

    this.conn.onreconnecting((_err) => {
      this.reconnecting = true;
    });

    this.conn.onreconnected((_id) => {
      this.reconnecting = false;
      this.emit({ type: 'connected' });
    });

    this.conn.on('message', (msg: any) => {
      try {
        const m = msg as Message & { conversationId?: string };
        const chatId = (m as any).conversationId || (m as any).chatId || '';
        this.emit({ type: 'message', chatId, message: m });
      } catch (e) {
        this.emit({ type: 'error', error: e });
      }
    });

    try {
      await this.conn.start();
      this.emit({ type: 'connected' });
    } catch (e) {
      this.emit({ type: 'error', error: e });
    }
  }

  // PUBLIC_INTERFACE
  async disconnect() {
    /** Disconnect SignalR */
    if (this.conn) {
      await this.conn.stop();
      this.conn = undefined;
    }
  }

  // PUBLIC_INTERFACE
  async joinConversation(conversationId: string) {
    /** Join a conversation group to receive messages */
    if (!this.conn) return;
    try {
      await this.conn.invoke('JoinConversation', conversationId);
    } catch (e) {
      this.emit({ type: 'error', error: e });
    }
  }

  // PUBLIC_INTERFACE
  async leaveConversation(conversationId: string) {
    /** Leave a conversation group */
    if (!this.conn) return;
    try {
      await this.conn.invoke('LeaveConversation', conversationId);
    } catch (e) {
      this.emit({ type: 'error', error: e });
    }
  }

  // PUBLIC_INTERFACE
  async sendText(conversationId: string, text: string) {
    /** Send a text message via SignalR */
    if (!this.conn) return false;
    try {
      await this.conn.invoke('SendMessage', conversationId, text);
      return true;
    } catch (e) {
      this.emit({ type: 'error', error: e });
      return false;
    }
  }
}

export const chatSocket = new ChatSocket();
