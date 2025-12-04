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
    return request<AuthResponse>('/auth/login', 'POST', { email, password });
  },
  // PUBLIC_INTERFACE
  async register(name: string, email: string, password: string) {
    /** Register user and receive token + user */
    return request<AuthResponse>('/auth/register', 'POST', { name, email, password });
  },
  // PUBLIC_INTERFACE
  async me() {
    /** Get current user profile */
    return request<User>('/users/me', 'GET');
  },
  // PUBLIC_INTERFACE
  async listChats() {
    /** List chats for current user */
    return request<Chat[]>('/chats', 'GET');
  },
  // PUBLIC_INTERFACE
  async getMessages(chatId: string) {
    /** Get messages for a chat */
    return request<Message[]>(`/chats/${encodeURIComponent(chatId)}/messages`, 'GET');
  },
  // PUBLIC_INTERFACE
  async sendMessage(chatId: string, payload: SendMessagePayload) {
    /** Send message in a chat */
    return request<Message>(`/chats/${encodeURIComponent(chatId)}/messages`, 'POST', payload);
  },
  // PUBLIC_INTERFACE
  async listContacts() {
    /** List user contacts */
    return request<Contact[]>('/contacts', 'GET');
  },
  // PUBLIC_INTERFACE
  async searchUsers(q: string) {
    /** Search users to add as contacts */
    const search = new URLSearchParams({ q }).toString();
    return request<Contact[]>(`/users/search?${search}`, 'GET');
  },
  // PUBLIC_INTERFACE
  async addContact(userId: string) {
    /** Add a user as contact */
    return request<Contact>('/contacts', 'POST', { userId });
  },
  // PUBLIC_INTERFACE
  async uploadMedia(uri: string, mime: string) {
    /** Upload media file, returns url */
    const token = await storage.getToken();
    const form = new FormData();
    // RN FormData file entry
    form.append('file', { uri, name: 'upload', type: mime } as unknown as Blob);
    const res = await fetch(`${CONFIG.API_BASE_URL}/media/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });
    if (!res.ok) {
      throw new Error('Upload failed');
    }
    return (await res.json()) as { url: string };
  },
};
