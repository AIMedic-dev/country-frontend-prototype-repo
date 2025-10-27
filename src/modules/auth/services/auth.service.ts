import { apiService } from '@/shared/services/api.service';
import type { LoginRequest, AuthResponse, UserProfile } from '../types/types';

class AuthService {
  private readonly BASE_PATH = '/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  /**
   * Login con código
   */
  async login(codigo: string): Promise<AuthResponse> {
    const request: LoginRequest = { codigo };
    const response = await apiService.post<AuthResponse>(
      `${this.BASE_PATH}/login`,
      request
    );

    // Guardar token y usuario en localStorage
    this.setToken(response.accessToken);
    this.setUser(response.user);

    return response;
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<UserProfile> {
    return apiService.get<UserProfile>(`${this.BASE_PATH}/profile`);
  }

  /**
   * Logout
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtener token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Guardar token en localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Eliminar token del localStorage
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Obtener usuario del localStorage
   */
  getUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Guardar usuario en localStorage
   */
  setUser(user: AuthResponse['user']): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Eliminar usuario del localStorage
   */
  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}

// Exportar instancia única
export const authService = new AuthService();