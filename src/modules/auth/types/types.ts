import type { UserRole } from "@/shared";

// ============================================
// DTOs de Request
// ============================================

export interface LoginRequest {
  codigo: string;
}

// ============================================
// DTOs de Response
// ============================================

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    nombre: string;
    rol: UserRole;
    codigo: string;
  };
}

export interface UserProfile {
  id: string;
  nombre: string;
  rol: UserRole;
  codigo: string;
  chats: string[];
  createdAt: string;
  updatedAt: string;
}