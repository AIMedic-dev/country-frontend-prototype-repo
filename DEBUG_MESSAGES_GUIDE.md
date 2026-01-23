# 🔍 Guía de Debugging: Mensajes en Chat

## 📊 Flujo Actual de Mensajes

```
Usuario escribe → useSendMessage hook 
    ↓
chatService.sendMessage() 
    ↓
POST /chats/{chatId}/messages (API REST)
    ↓
Backend recibe y procesa
    ↓
Respuesta: SendMessageResponse { content, answer, timestamp }
    ↓
WebSocket emite eventos: ai-response-start → ai-response-chunk → ai-response-end
    ↓
UI muestra respuesta streaming
```

---

## 🐛 Verificar si los mensajes llegan al Backend

### Opción 1: Agregar logging en el hook `useSendMessage` ✅

En el archivo [src/modules/chat/hooks/useSendMessage.ts](src/modules/chat/hooks/useSendMessage.ts):

```typescript
const sendMessage = async (content: string): Promise<void> => {
  if (!content.trim()) {
    setError('El mensaje no puede estar vacío');
    return;
  }

  try {
    setIsSending(true);
    setError(null);

    const request: SendMessageRequest = {
      content: content.trim(),
    };

    // 🔍 DEBUG: Log antes de enviar
    console.log('📤 Enviando mensaje al backend:', {
      chatId,
      request,
      timestamp: new Date().toISOString(),
    });

    const response = await chatService.sendMessage(chatId, request);

    // 🔍 DEBUG: Log de respuesta recibida
    console.log('📥 Respuesta del backend:', {
      response,
      timestamp: new Date().toISOString(),
    });

    // Crear objeto Message compatible
    const newMessage: Message = {
      content: response.content,
      answer: response.answer,
      timestamp: response.timestamp,
    };

    // Notificar mensaje enviado
    if (onMessageSent) {
      await onMessageSent(newMessage);
    }
  } catch (err) {
    console.error('❌ Error enviando mensaje:', err);
    setError('Error al enviar el mensaje');
    throw err;
  } finally {
    setIsSending(false);
  }
};
```

### Opción 2: Agregar logging en el servicio de chat ✅

En [src/modules/chat/services/chat.service.ts](src/modules/chat/services/chat.service.ts):

```typescript
async sendMessage(
  chatId: string, 
  data: SendMessageRequest
): Promise<SendMessageResponse> {
  const endpoint = `${this.BASE_PATH}/${chatId}/messages`;
  
  // 🔍 DEBUG: Log de la petición
  console.log('🔗 POST Request:', {
    endpoint,
    fullPath: `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
    body: data,
    method: 'POST',
  });
  
  return apiService.post<SendMessageResponse>(endpoint, data);
}
```

### Opción 3: Agregar logging en el interceptor de Axios ✅

En [src/shared/services/api.service.ts](src/shared/services/api.service.ts):

```typescript
private setupInterceptors(): void {
  // Request interceptor
  this.axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 🔍 DEBUG: Log todas las peticiones
      console.log('📡 API Request:', {
        method: config.method.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
        timestamp: new Date().toISOString(),
      });
      
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  this.axiosInstance.interceptors.response.use(
    (response: any) => {
      // 🔍 DEBUG: Log de respuestas exitosas
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
        timestamp: new Date().toISOString(),
      });
      return response;
    },
    (error: AxiosError<ApiError>) => {
      // Manejar errores...
      
      // 🔍 DEBUG: Log de errores
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        responseData: error.response?.data,
        timestamp: new Date().toISOString(),
      });
      
      // ... resto del manejo de errores
    }
  );
}
```

---

## 🛠️ Pasos para Debuggear

### 1. Abre la consola del navegador (F12)

### 2. En la pestaña **Console**, busca logs de:
   - `📤 Enviando mensaje al backend:` → Mensaje enviado ✅
   - `🔗 POST Request:` → URL completa de la petición
   - `📡 API Request:` → Detalles de la petición HTTP
   - `📥 Respuesta del backend:` → Respuesta recibida del servidor

### 3. En la pestaña **Network**:
   - Filtra por `XHR` (XMLHttpRequest)
   - Busca la petición POST a `/chats/{chatId}/messages`
   - Verifica:
     - **Status**: Debe ser `200` o `201`
     - **Headers**: Busca `Authorization: Bearer token`
     - **Request Body**: Debe contener el contenido del mensaje
     - **Response**: Debe contener `content`, `answer`, `timestamp`

---

## 🔧 Soluciones Comunes

### Problema: El endpoint no existe en el backend
**Solución**: Verifica que tu backend tenga la ruta:
```
POST /chats/{chatId}/messages
```

### Problema: Error 401 (No autorizado)
**Solución**: Asegúrate de:
1. Estar logeado (token en localStorage)
2. El token sea válido
3. El header `Authorization: Bearer {token}` se envíe

### Problema: Error 404 (No encontrado)
**Solución**: 
1. Verifica que `chatId` sea válido
2. Que el endpoint es exacto: `/chats/{chatId}/messages`

### Problema: CORS error
**Solución**: Configura CORS en el backend:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 📋 Checklist de Verificación

- [ ] Console muestra log `📤 Enviando mensaje...`
- [ ] Network tab muestra POST request a `/chats/{chatId}/messages`
- [ ] Status code es 200/201
- [ ] Request tiene `Authorization` header
- [ ] Response body contiene `content`, `answer`, `timestamp`
- [ ] Console muestra log `📥 Respuesta del backend...`
- [ ] WebSocket recibe eventos `ai-response-start`, `ai-response-chunk`, `ai-response-end`

---

## 🚀 Próximos Pasos

1. **Implementa uno de los logs** (Opción 1, 2 o 3)
2. **Abre el navegador Console (F12)**
3. **Envía un mensaje**
4. **Copia los logs** que veas
5. **Comparte conmigo** para análisis detallado

---

## 📌 Archivos Implicados en el Flujo

| Archivo | Responsabilidad |
|---------|-----------------|
| [src/modules/chat/hooks/useSendMessage.ts](src/modules/chat/hooks/useSendMessage.ts) | Hook que envía mensaje |
| [src/modules/chat/services/chat.service.ts](src/modules/chat/services/chat.service.ts) | Llamada API para enviar |
| [src/shared/services/api.service.ts](src/shared/services/api.service.ts) | Configuración de Axios |
| [src/modules/chat/hooks/useWebSocket.ts](src/modules/chat/hooks/useWebSocket.ts) | Recibe respuesta en tiempo real |
| [src/shared/config/env.ts](src/shared/config/env.ts) | Variables de entorno (URL API) |
