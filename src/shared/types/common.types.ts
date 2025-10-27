export type UserRole = 'paciente' | 'empleado';

export interface User {
  id: string;
  nombre: string;
  rol: UserRole;
  chats: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  content: string;
  answer: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}