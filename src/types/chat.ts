export type ChatStatus = 'active' | 'student_closed' | 'volunteer_completed' | 'archived';
export type MessageType = 'text' | 'system' | 'admin';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Chat {
  id: string;
  studentUserId: string;
  volunteerUserId: string;
  createdBy: string;
  status: ChatStatus;
  closedBy: string | null;
  closedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface ChatParticipant {
  id: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'volunteer' | 'admin';
  isOnline: boolean;
  lastSeen: Date;
}

export interface ChatThread extends Chat {
  participant: ChatParticipant;
  messages: Message[];
}

export interface ChatPreview {
  id: string;
  participant: ChatParticipant;
  lastMessage: Message | null;
  unreadCount: number;
  status: ChatStatus;
  updatedAt: Date;
}

// Form and input types
export interface SendMessageData {
  content: string;
  messageType?: MessageType;
}

export interface CreateChatData {
  studentUserId: string;
  volunteerUserId: string;
}

export interface AdminMessageData {
  recipientId: string;
  content: string;
  subject?: string;
}

// API response types
export interface ChatResponse {
  chat: Chat;
  error?: string;
}

export interface ChatsResponse {
  chats: ChatPreview[];
  error?: string;
}

export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  nextCursor?: string;
  error?: string;
}

export interface SendMessageResponse {
  message: Message;
  error?: string;
}

// Real-time event types
export interface ChatEvent {
  type: 'message' | 'status_change' | 'user_typing' | 'user_online';
  chatId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

export interface TypingEvent {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

export interface OnlineStatusEvent {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
}

