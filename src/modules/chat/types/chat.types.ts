import type { Message, Chat } from '@/shared/types/common.types';

// ============================================
// DTOs de Request
// ============================================

export interface CreateChatRequest {
  userId: string;
}

export interface SendMessageRequest {
  content: string;
}

// ============================================
// DTOs de Response
// ============================================

export interface SendMessageResponse {
  content: string;
  answer: string;
  timestamp: string;
}

// ============================================
// Eventos de WebSocket para Chat
// ============================================

export interface AiResponseStartEvent {
  chatId: string;
}

export interface AiResponseChunkEvent {
  chatId: string;
  chunk: string;
}

export interface AiResponseEndEvent {
  chatId: string;
  message: Message;
}

export interface ChatCreatedEvent {
  userId: string;
  chat: Chat;
}

export interface ChatDeletedEvent {
  chatId: string;
}

export interface ChatErrorEvent {
  chatId: string;
  error: string;
}

// Re-exportar para conveniencia
export type { Message, Chat };