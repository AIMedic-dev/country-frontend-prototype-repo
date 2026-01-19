export const USER_ROLES = {
  PACIENTE: 'paciente',
  EMPLEADO: 'empleado',
  ADMIN: 'admin',
} as const;

export const USER_ROLE_LABELS = {
  paciente: 'Paciente',
  empleado: 'Colaborador',
  admin: 'Administrador',
} as const;

export const API_ENDPOINTS = {
  USERS: '/users',
  CHATS: '/chats',
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'current_user',
} as const;

export const QUERY_KEYS = {
  USER: 'user',
  USERS: 'users',
  CHAT: 'chat',
  CHATS: 'chats',
  MESSAGES: 'messages',
} as const;