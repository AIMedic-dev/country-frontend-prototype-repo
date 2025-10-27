import { apiService } from "../../../shared";
import type { Chat, Message } from '@/shared/types/common.types';
import type { 
  CreateChatRequest, 
  SendMessageRequest, 
  SendMessageResponse 
} from '../types/chat.types';

class ChatService {
  private readonly BASE_PATH = '/chats';

  /**
   * Obtener todos los chats
   */
  async getAllChats(): Promise<Chat[]> {
    return apiService.get<Chat[]>(this.BASE_PATH);
  }

  /**
   * Obtener chats por usuario
   */
  async getChatsByUser(userId: string): Promise<Chat[]> {
    return apiService.get<Chat[]>(`${this.BASE_PATH}/user/${userId}`);
  }

  /**
   * Obtener un chat específico
   */
  async getChatById(chatId: string): Promise<Chat> {
    return apiService.get<Chat>(`${this.BASE_PATH}/${chatId}`);
  }

  /**
   * Crear un nuevo chat
   */
  async createChat(data: CreateChatRequest): Promise<Chat> {
    return apiService.post<Chat>(this.BASE_PATH, data);
  }

  /**
   * Enviar mensaje a un chat (interactúa con IA)
   */
  async sendMessage(
    chatId: string, 
    data: SendMessageRequest
  ): Promise<SendMessageResponse> {
    return apiService.post<SendMessageResponse>(
      `${this.BASE_PATH}/${chatId}/messages`,
      data
    );
  }

  /**
   * Obtener mensajes de un chat
   */
  async getMessages(chatId: string): Promise<Message[]> {
    return apiService.get<Message[]>(`${this.BASE_PATH}/${chatId}/messages`);
  }

  /**
   * Limpiar mensajes de un chat
   */
  async clearMessages(chatId: string): Promise<void> {
    return apiService.delete<void>(`${this.BASE_PATH}/${chatId}/messages`);
  }

  /**
   * Eliminar un chat
   */
  async deleteChat(chatId: string): Promise<void> {
    return apiService.delete<void>(`${this.BASE_PATH}/${chatId}`);
  }
}

// Exportar instancia única
export const chatService = new ChatService();