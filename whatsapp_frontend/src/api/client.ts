import { CONFIG } from '../config';
import { storage } from '../storage';
import type { AuthResponse, Chat, Contact, Message, MessageType, User } from '../types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, method: HttpMethod = 'GET', body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
  const token = await storage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
  const res = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const data = (await res.json()) as { message?: string };
      msg = data?.message || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  try {
    return (await res.json()) as T;
  } catch {
    // no content
    return {} as T;
  }
}

type SendMessagePayload = { type: MessageType; content?: string; mediaUrl?: string };

// PUBLIC_INTERFACE
export const api = {
  // PUBLIC_INTERFACE
  async login(email: string, password: string) {
    /** Authenticate and receive token + user */
    return request<AuthResponse>('/api/Auth/login', 'POST', { email, password });
  },
  // PUBLIC_INTERFACE
  async register(name: string, email: string, password: string) {
    /** Register user and receive token + user */
    return request<AuthResponse>('/api/Auth/register', 'POST', { displayName: name, email, password });
  },
  // PUBLIC_INTERFACE
  async me() {
    /** Get current user profile */
    return request<User>('/api/Auth/me', 'GET');
  },
  // PUBLIC_INTERFACE
  async listChats() {
    /** List chats for current user */
    return request<Chat[]>('/api/Conversations', 'GET');
  },
  // PUBLIC_INTERFACE
  async getMessages(chatId: string, limit = 50, offset = 0) {
    /** Get messages for a chat */
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) }).toString();
    return request<Message[]>(`/api/Messages/${encodeURIComponent(chatId)}?${params}`, 'GET');
  },
  // PUBLIC_INTERFACE
  async sendMessage(chatId: string, payload: SendMessagePayload) {
    /** Send message in a chat (text or image url as text fallback) */
    if (payload.type === 'image' && payload.mediaUrl) {
      return request<Message>('/api/Messages/send', 'POST', { conversationId: chatId, text: payload.mediaUrl });
    }
    return request<Message>('/api/Messages/send', 'POST', { conversationId: chatId, text: payload.content });
  },
  // PUBLIC_INTERFACE
  async listContacts() {
    /** List user contacts */
    return request<Contact[]>('/api/Contacts', 'GET');
  },
  // PUBLIC_INTERFACE
  async searchUsers(q: string) {
    /** Search users to add as contacts - best effort */
    try {
      const search = new URLSearchParams({ q }).toString();
      return await request<Contact[]>(`/api/Users/search?${search}`, 'GET');
    } catch {
      return [];
    }
  },
  // PUBLIC_INTERFACE
  async addContact(userId: string) {
    /** Create or get direct conversation with a user and return as contact-like info */
    const conv = await request<{ id: string; title?: string; avatar?: string }>('/api/Conversations/direct', 'POST', { otherUserId: userId });
    return { id: userId, name: conv.title, chatId: conv.id } as unknown as Contact;
  },
  // PUBLIC_INTERFACE
  async uploadMedia(uri: string, mime: string) {
    /** Upload media file by sending media via send-media; returns an accessible url from message */
    const token = await storage.getToken();
    const form = new FormData();
    // RN FormData file entry
    form.append('file', { uri, name: 'upload', type: mime } as unknown as Blob);
    const res = await fetch(`${CONFIG.API_BASE_URL}/api/Messages/send-media`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });
    if (!res.ok) {
      throw new Error('Upload failed');
    }
    const msg = (await res.json()) as Message;
    return { url: (msg as any).mediaUrl || msg.content || '' } as { url: string };
  },
  // PUBLIC_INTERFACE
  async registerPushToken(expoPushToken: string) {
    /** Register Expo push token */
    return request<{ success: boolean }>('/api/Users/push-token', 'POST', { expoPushToken });
  },
};
