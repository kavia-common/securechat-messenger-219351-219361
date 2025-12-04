export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Chat = {
  id: string;
  title?: string;
  avatar?: string;
  lastMessage?: Message;
};

export type MessageStatus = 'sent' | 'delivered' | 'read';

export type MessageType = 'text' | 'image' | 'file';

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  time?: string;
  status?: MessageStatus;
  isMine?: boolean;
};

export type Contact = {
  id: string;
  name?: string;
  avatar?: string;
  status?: string;
  chatId?: string;
};

// For ChatSocket payloads
export type IncomingSocketEvent =
  | { event: 'message'; chatId: string; message: Message }
  | { event: 'typing'; chatId: string; isTyping: boolean }
  | { event: 'pong' };

export type OutgoingSocketEvent =
  | { event: 'typing'; chatId: string; isTyping: boolean }
  | { event: 'ping' };
