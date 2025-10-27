export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export interface AuthContextState {
  user: {
    id: string;
    nombre: string;
    rol: string;
    codigo: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

