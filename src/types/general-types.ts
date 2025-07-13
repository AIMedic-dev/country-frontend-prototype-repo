export type TokenPayload = {
  email: string;
  sub: string;
  projects?: string[];
  iat: number;
  exp: number;
  userName?: string;
};

// Definir la interfaz del contexto
export interface AuthContextType {
  user: TokenPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  hasVascularAccess: boolean;
  isLoading: boolean;
  logout: () => void;
  login: (token: string) => boolean;
}
