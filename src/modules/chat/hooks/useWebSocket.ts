import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface StreamingMessage {
  chatId: string;
  content: string;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  streamingResponse: string;
  isStreaming: boolean;
  isConnected: boolean;
}

/**
 * Hook para manejar la conexión WebSocket y el streaming de respuestas de IA
 * @param serverUrl - URL del servidor WebSocket (default: http://localhost:3000)
 */
export const useWebSocket = (
  serverUrl = process.env.BACK_WS_URL
): UseWebSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Crear conexión WebSocket
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    // Evento: Conexión exitosa
    newSocket.on('connect', () => {
      console.log('✅ WebSocket conectado');
      setIsConnected(true);
    });

    // Evento: Desconexión
    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
      setIsConnected(false);
    });

    // Evento: Inicio del streaming
    newSocket.on('ai-response-start', (data: { chatId: string }) => {
      console.log('🚀 Iniciando streaming para chat:', data.chatId);
      setIsStreaming(true);
      setStreamingResponse('');
    });

    // Evento: Chunk de respuesta en tiempo real
    newSocket.on('ai-response-chunk', (data: { chatId: string; chunk: string }) => {
      console.log('📝 Chunk recibido:', data.chunk);
      setStreamingResponse((prev) => prev + data.chunk);
    });

    // Evento: Fin del streaming
    newSocket.on('ai-response-end', (data: StreamingMessage) => {
      console.log('✅ Streaming finalizado para chat:', data.chatId);
      
      // Limpiar inmediatamente para respuestas largas
      setIsStreaming(false);
      
      // Limpiar el texto después de un momento
      setTimeout(() => {
        setStreamingResponse('');
      }, 200);
    });

    // Evento: Error
    newSocket.on('error', (data: { chatId: string; error: string }) => {
      console.error('❌ Error en WebSocket:', data.error);
      setIsStreaming(false);
      setStreamingResponse('');
    });

    setSocket(newSocket);

    // Cleanup: Desconectar al desmontar
    return () => {
      console.log('🔌 Cerrando conexión WebSocket');
      newSocket.close();
    };
  }, [serverUrl]);

  // Método para limpiar el streaming manualmente
  const clearStreaming = useCallback(() => {
    setStreamingResponse('');
    setIsStreaming(false);
  }, []);

  return {
    socket,
    streamingResponse,
    isStreaming,
    isConnected,
  };
};