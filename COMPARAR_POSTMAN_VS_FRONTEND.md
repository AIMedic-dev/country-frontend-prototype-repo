# 🔧 Comparar: Qué envía Postman vs Qué envía el Frontend

## 📌 El Problema

El backend **funciona con Postman** pero **no con el frontend**. Esto significa:
- El endpoint existe ✅
- El backend está correcto ✅
- **El frontend NO está enviando los datos correctamente** ❌

---

## 📤 ¿QUÉ DEBE ENVIAR EL FRONTEND?

Mira el archivo [src/modules/chat/types/chat.types.ts](src/modules/chat/types/chat.types.ts):

```typescript
export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  content: string;
  answer: string;
  timestamp: string;
}
```

---

## 🔍 PASO 1: Ve exactamente QUÉ envía el frontend

Edita [src/modules/chat/hooks/useSendMessage.ts](src/modules/chat/hooks/useSendMessage.ts) y cambia esto:

**ANTES:**
```typescript
const response = await chatService.sendMessage(chatId, request);
```

**DESPUÉS:**
```typescript
console.log('🔴 ENVIANDO AL BACKEND:', {
  chatId,
  endpoint: `/chats/${chatId}/messages`,
  request,
  jsonString: JSON.stringify(request),
});

const response = await chatService.sendMessage(chatId, request);

console.log('🟢 RESPUESTA DEL BACKEND:', {
  response,
  jsonString: JSON.stringify(response),
});
```

---

## 📋 PASO 2: Abre el Dev Tools (F12) en el navegador

### En la pestaña **Console**:
- Envía un mensaje
- Busca los logs `🔴 ENVIANDO AL BACKEND:` y `🟢 RESPUESTA DEL BACKEND:`
- **Copia exactamente** lo que ves

### En la pestaña **Network**:
- Filtra por `XHR`
- Busca la petición POST a `/chats/{chatId}/messages`
- Haz clic en ella
- Ve a **Request > Request Payload** y **Response**
- Copia el JSON completo de ambos

---

## 📊 PASO 3: Compara con Postman

### En Postman:
1. POST a `http://localhost:3000/api/v1/chats/{chatId}/messages`
2. Headers: `Authorization: Bearer {token}`
3. Body (JSON):
```json
{
  "content": "Hola, tengo una pregunta"
}
```

4. La respuesta debe ser:
```json
{
  "content": "Hola, tengo una pregunta",
  "answer": "La respuesta de la IA aquí...",
  "timestamp": "2026-01-22T10:30:00Z"
}
```

---

## 🎯 ¿Qué podría estar mal?

### Posibilidad 1: El `content` no se está enviando
**Síntoma:** Console muestra `request: { content: "" }` o `content: undefined`

### Posibilidad 2: El backend espera otro campo
**Síntoma:** Postman envía `{ content: "..." }` y Postman funciona, pero frontend envía otra cosa

### Posibilidad 3: Diferencia en estructura de respuesta
**Síntoma:** Backend devuelve `{ data: { content, answer } }` pero frontend espera `{ content, answer }`

### Posibilidad 4: Falta información en el request
**Síntoma:** El backend necesita `{ content, end: true }` o algo adicional

---

## 🚨 ACCIÓN INMEDIATA

1. Agrega los logs en el hook
2. Reinicia el servidor (`npm run dev`)
3. Abre F12 Console
4. Envía un mensaje en el chat
5. **Copia los logs** de `🔴 ENVIANDO` y `🟢 RESPUESTA`
6. **Comparte exactamente qué ves**

Así podremos identificar la diferencia entre Postman y el frontend.

---

## 💡 Otra forma rápida: Networking tab

Sin editar código, abre F12 → Network → envía mensaje → busca la petición POST → Copia como cURL:

```
Clic derecho en petición → Copy as cURL
```

Pega ese cURL aquí y podemos ver exactamente qué se envía.
