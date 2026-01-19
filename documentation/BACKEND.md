# 💬 Chat con IA - Backend API

API REST + WebSocket desarrollada con NestJS para un sistema de chat con inteligencia artificial en tiempo real. El sistema permite a usuarios interactuar con un asistente de IA especializado con respuestas en streaming, similar a ChatGPT.

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Documentation](#-api-documentation)
- [Base de Datos](#️-base-de-datos)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Próximos Pasos](#-próximos-pasos)

## 💻 Ejemplo de Implementación Frontend

### React Hook para WebSocket

```typescript
// hooks/useRealtimeChat.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useRealtimeChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    // Inicio del streaming
    newSocket.on('ai-response-start', () => {
      setIsStreaming(true);
      setStreamingResponse('');
    });

    // Chunks en tiempo real
    newSocket.on('ai-response-chunk', (data) => {
      setStreamingResponse(prev => prev + data.chunk);
    });

    // Fin del streaming
    newSocket.on('ai-response-end', () => {
      setIsStreaming(false);
    });

    // Errores
    newSocket.on('error', (data) => {
      console.error('❌ Error:', data.error);
      setIsStreaming(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, streamingResponse, isStreaming };
};
```

### Componente de Chat

```tsx
// components/ChatInterface.tsx
import { useState } from 'react';
import { useRealtimeChat } from '../hooks/useRealtimeChat';

export const ChatInterface = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { streamingResponse, isStreaming } = useRealtimeChat();

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { content: input, isUser: true }]);
    const userMessage = input;
    setInput('');

    try {
      // POST REST
      const response = await fetch(
        `http://localhost:3000/api/v1/chats/${chatId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            content: userMessage,
            n: 5,
            temperature: 0.7,
            maxTokens: 128
          }),
        }
      );

      const data = await response.json();
      
      // Agregar respuesta completa
      setMessages(prev => [...prev, { 
        content: data.answer, 
        isUser: false 
      }]);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.isUser ? 'user-msg' : 'ai-msg'}>
            {msg.content}
          </div>
        ))}

        {/* Mostrar streaming en tiempo real */}
        {isStreaming && (
          <div className="ai-msg streaming">
            {streamingResponse}
            <span className="cursor">▊</span>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming}>
          {isStreaming ? 'Generando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};
```

---

## 🛠 Tecnologías

- **Framework**: NestJS 10.x
- **Base de Datos**: MongoDB con Mongoose
- **Lenguaje**: TypeScript
- **Validación**: class-validator, class-transformer
- **HTTP Client**: @nestjs/axios
- **Configuración**: @nestjs/config
- **Real-time**: WebSocket (Socket.io)
- **IA**: Streaming SSE (Server-Sent Events)

---

## 🏗 Arquitectura

El proyecto sigue una arquitectura modular basada en NestJS con separación clara de responsabilidades y comunicación en tiempo real:

### Módulos Principales

1. **User Module**: Gestión de usuarios (CRUD)
2. **Chats Module**: Gestión de chats y mensajes con IA en tiempo real
3. **Auth Module**: *(Próximamente)* Autenticación y autorización

### Comunicación

- **REST API**: Operaciones CRUD (crear/listar/eliminar)
- **WebSocket**: Streaming en tiempo real de respuestas de IA
- **SSE**: El backend consume Server-Sent Events del modelo de IA

### Flujo de Streaming

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│             │  POST   │              │   SSE   │             │
│  Frontend   │────────>│   Backend    │────────>│  AI Model   │
│             │         │   (NestJS)   │         │  (Python)   │
│             │         │              │         │             │
│             │  WebSocket streaming   │<────────│ streaming   │
│             │<────────│              │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │                        │
      └────────────────────────┘
          Real-time Updates
```

### Arquitectura de Capas

```
┌─────────────────────────────────────────┐
│         Frontend (React/Next.js)        │
│  - Socket.io Client                     │
│  - REST API Calls                       │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         Backend (NestJS)                │
│  ┌────────────────────────────────┐    │
│  │   WebSocket Gateway            │    │
│  │   - Emit events to clients     │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │   REST Controllers             │    │
│  │   - User, Chats endpoints      │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │   Services Layer               │    │
│  │   - Business logic             │    │
│  │   - SSE consumption            │    │
│  └────────────────────────────────┘    │
└───────────────┬─────────────────────────┘
                │
    ┌───────────┴───────────┐
    ▼                       ▼
┌─────────┐         ┌──────────────┐
│ MongoDB │         │  AI Model    │
│         │         │  (SSE)       │
└─────────┘         └──────────────┘
```

### Principios de Diseño

- ✅ **SOLID Principles**
- ✅ **Clean Code**
- ✅ **Separation of Concerns**
- ✅ **Scalable Architecture**
- ✅ **Easy to Maintain**

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **MongoDB**: v6.x o superior (local o en la nube)
- **Modelo de IA**: Servicio de IA con endpoint SSE corriendo
- **Git**: Para clonar el repositorio

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd chat-ia-backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Dependencias Principales

El proyecto utiliza las siguientes dependencias:

```json
{
  "@nestjs/common": "^10.x",
  "@nestjs/core": "^10.x",
  "@nestjs/mongoose": "^10.x",
  "@nestjs/axios": "^3.x",
  "@nestjs/config": "^3.x",
  "@nestjs/websockets": "^10.x",
  "@nestjs/platform-socket.io": "^10.x",
  "mongoose": "^8.x",
  "class-validator": "^0.14.x",
  "class-transformer": "^0.5.x",
  "socket.io": "^4.x",
  "axios": "^1.x"
}
```

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# ===========================================
# MongoDB Configuration
# ===========================================
MONGODB_URI=mongodb://localhost:27017/chat-ia-database

# ===========================================
# Application Configuration
# ===========================================
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1

# ===========================================
# CORS Configuration
# ===========================================
CORS_ENABLED=true
CORS_ORIGINS=http://localhost:3000,http://localhost:4200

# ===========================================
# AI Model Configuration (SSE Streaming)
# ===========================================
MODELO_IA=http://localhost:8000/api/v1/qa/stream
AI_CONTEXT_SIZE=5
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=128
AI_TIMEOUT=60000
AI_RETRY_ATTEMPTS=3
```

### Configuración de MongoDB

#### Opción 1: MongoDB Local

```bash
# Instalar MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Iniciar MongoDB
mongod --dbpath /data/db
```

#### Opción 2: MongoDB Atlas (Cloud)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Obtener connection string
4. Actualizar `MONGODB_URI` en `.env`

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-ia-database?retryWrites=true&w=majority
```

---

## 🎯 Ejecución

### Antes de Ejecutar

**IMPORTANTE**: Asegúrate de que el modelo de IA esté corriendo:

```bash
# En el directorio del modelo de IA (puerto 8000)
python main.py  # o el comando que uses para iniciar tu modelo
```

Verifica que esté disponible en: `http://localhost:8000/api/v1/qa/stream`

### Modo Desarrollo

```bash
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3000`

**Logs de inicio:**
```
🚀 Application is running on: http://localhost:3000
📝 Environment: development
🌐 API base URL: http://localhost:3000/api/v1
📚 Example endpoints:
   - REST: http://localhost:3000/api/v1/users
   - REST: http://localhost:3000/api/v1/chats
   - WebSocket: ws://localhost:3000
🤖 AI Model URL: http://localhost:8000/api/v1/qa/stream
⚡ WebSocket enabled for real-time streaming
```

### Modo Producción

```bash
# Build
npm run build

# Start
npm run start:prod
```

### Verificar Estado

```bash
curl http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
src/
├── common/                          # Código compartido
│   ├── decorators/                  # Decoradores personalizados
│   ├── filters/                     # Filtros de excepciones
│   ├── guards/                      # Guards de autenticación
│   ├── interceptors/                # Interceptores
│   └── pipes/                       # Pipes de validación
│
├── config/                          # Configuración
│   ├── database.config.ts           # Config de MongoDB
│   └── app.config.ts                # Config general
│
├── modules/                         # Módulos de negocio
│   │
│   ├── user/                        # 👤 USER MODULE
│   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── user-response.dto.ts
│   │   │
│   │   ├── entities/                # Entidades de MongoDB
│   │   │   └── user.entity.ts
│   │   │
│   │   ├── user.controller.ts       # Controlador (rutas)
│   │   ├── user.service.ts          # Lógica de negocio
│   │   └── user.module.ts           # Módulo
│   │
│   └── chats/                       # 💬 CHATS MODULE
│       ├── dto/
│       │   ├── create-chat.dto.ts
│       │   ├── send-message.dto.ts
│       │   └── chat-response.dto.ts
│       │
│       ├── entities/
│       │   ├── chat.entity.ts
│       │   └── message.entity.ts
│       │
│       ├── interfaces/
│       │   └── ai-request.interface.ts
│       │
│       ├── services/
│       │   └── ai.service.ts        # Servicio para consumir IA
│       │
│       ├── chats.controller.ts      # Controlador REST
│       ├── chats.service.ts         # Lógica de negocio
│       └── chats.module.ts          # Módulo
│
├── app.module.ts                    # Módulo raíz
└── main.ts                          # Entry point
```

---

## 📚 API Documentation

### Base URLs

```
REST API:    http://localhost:3000/api/v1
WebSocket:   ws://localhost:3000
```

---

## 🔌 WebSocket Events

El backend emite eventos WebSocket para streaming en tiempo real.

### Events to Listen (Server → Client)

#### 1. `ai-response-start`
Se emite cuando comienza la generación de la respuesta de IA.

```json
{
  "chatId": "507f191e810c19729de860ea"
}
```

#### 2. `ai-response-chunk`
Se emite por cada chunk/palabra generada (streaming real).

```json
{
  "chatId": "507f191e810c19729de860ea",
  "chunk": "El "
}
```

#### 3. `ai-response-end`
Se emite cuando termina la generación completa.

```json
{
  "chatId": "507f191e810c19729de860ea",
  "message": {
    "content": "¿Qué es el cáncer?",
    "answer": "El cáncer es...",
    "timestamp": "2025-10-06T20:00:00.000Z"
  }
}
```

#### 4. `chat-created`
Se emite cuando se crea un nuevo chat.

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "chat": { ... }
}
```

#### 5. `chat-deleted`
Se emite cuando se elimina un chat.

```json
{
  "chatId": "507f191e810c19729de860ea"
}
```

#### 6. `error`
Se emite cuando ocurre un error.

```json
{
  "chatId": "507f191e810c19729de860ea",
  "error": "Error message"
}
```

---

## 👤 User Endpoints

### 1. Crear Usuario

```http
POST /users
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "rol": "paciente"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "nombre": "Juan Pérez",
  "rol": "paciente",
  "chats": [],
  "createdAt": "2025-10-02T10:00:00.000Z",
  "updatedAt": "2025-10-02T10:00:00.000Z"
}
```

### 2. Obtener Todos los Usuarios

```http
GET /users
```

### 3. Obtener Usuario por ID

```http
GET /users/:id
```

### 4. Actualizar Usuario

```http
PATCH /users/:id
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez"
}
```

### 5. Eliminar Usuario

```http
DELETE /users/:id
```

### 6. Crear Múltiples Usuarios

```http
POST /users/bulk
Content-Type: application/json

[
  {
    "nombre": "Juan Pérez",
    "rol": "paciente",
    "codigo": "USER001"
  },
  {
    "nombre": "María García",
    "rol": "empleado",
    "codigo": "USER002"
  }
]
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "rol": "paciente",
    "chats": [],
    "createdAt": "2025-10-02T10:00:00.000Z",
    "updatedAt": "2025-10-02T10:00:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "nombre": "María García",
    "rol": "empleado",
    "chats": [],
    "createdAt": "2025-10-02T10:00:01.000Z",
    "updatedAt": "2025-10-02T10:00:01.000Z"
  }
]
```

**Validaciones y reglas:**
- No se permiten códigos duplicados dentro del mismo request.
- No se permiten códigos que ya existan en la base de datos.
- Todos los campos (`nombre`, `rol`, `codigo`) son requeridos.
- `rol` debe ser `"paciente"`, `"empleado"` o `"admin"`.

### 6. Obtener Chats de un Usuario

```http
GET /users/:id/chats
```

---

## 🔷 GraphQL API

El proyecto incluye soporte para GraphQL además de REST. Puedes acceder al playground de GraphQL en:

```
http://localhost:3000/graphql
```

### Mutations

#### Crear Múltiples Usuarios

Permite crear varios usuarios en una sola operación.

**Mutation:**
```graphql
mutation CreateUsers($input: CreateUsersInput!) {
  createUsers(input: $input) {
    created
    users {
      id
      nombre
      rol
      createdAt
      updatedAt
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "users": [
      {
        "nombre": "Juan Pérez",
        "rol": "paciente",
        "codigo": "USER001"
      },
      {
        "nombre": "María García",
        "rol": "empleado",
        "codigo": "USER002"
      },
      {
        "nombre": "Carlos López",
        "rol": "paciente",
        "codigo": "USER003"
      }
    ]
  }
}
```

**Response:**
```json
{
  "data": {
    "createUsers": {
      "created": 3,
      "users": [
        {
          "id": "507f1f77bcf86cd799439011",
          "nombre": "Juan Pérez",
          "rol": "paciente",
          "createdAt": "2025-10-02T10:00:00.000Z",
          "updatedAt": "2025-10-02T10:00:00.000Z"
        },
        {
          "id": "507f1f77bcf86cd799439012",
          "nombre": "María García",
          "rol": "empleado",
          "createdAt": "2025-10-02T10:00:01.000Z",
          "updatedAt": "2025-10-02T10:00:01.000Z"
        },
        {
          "id": "507f1f77bcf86cd799439013",
          "nombre": "Carlos López",
          "rol": "paciente",
          "createdAt": "2025-10-02T10:00:02.000Z",
          "updatedAt": "2025-10-02T10:00:02.000Z"
        }
      ]
    }
  }
}
```

**Validaciones:**
- No se permiten códigos duplicados en el mismo request
- No se permiten códigos que ya existan en la base de datos
- Todos los campos son requeridos (`nombre`, `rol`, `codigo`)
- El `rol` debe ser `"paciente"`, `"empleado"` o `"admin"`

**Errores:**
- `400 Bad Request`: Si hay códigos duplicados en el input
- `409 Conflict`: Si alguno de los códigos ya existe en la base de datos

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateUsers($input: CreateUsersInput!) { createUsers(input: $input) { created users { id nombre rol } } }",
    "variables": {
      "input": {
        "users": [
          {
            "nombre": "Juan Pérez",
            "rol": "paciente",
            "codigo": "USER001"
          }
        ]
      }
    }
  }'
```

---

## 💬 Chat Endpoints

### 1. Crear Chat

```http
POST /chats
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "id": "507f191e810c19729de860ea",
  "userId": "507f1f77bcf86cd799439011",
  "messages": [],
  "createdAt": "2025-10-02T10:00:00.000Z",
  "updatedAt": "2025-10-02T10:00:00.000Z"
}
```

### 2. Obtener Todos los Chats

```http
GET /chats
```

### 3. Obtener Chats por Usuario

```http
GET /chats/user/:userId
```

**Response:**
```json
[
  {
    "id": "507f191e810c19729de860ea",
    "userId": "507f1f77bcf86cd799439011",
    "messages": [],
    "createdAt": "2025-10-02T10:00:00.000Z",
    "updatedAt": "2025-10-02T10:00:00.000Z"
  }
]
```

### 3.1. Obtener Chats por Código de Usuario

```http
GET /chats/user/codigo/:codigo
```

Obtiene todos los chats activos de un usuario utilizando su código único en lugar del ID.

**Parámetros:**
- `codigo` (string, requerido): Código único del usuario (ej: "TEST2025")

**Response:**
```json
[
  {
    "id": "507f191e810c19729de860ea",
    "userId": "507f1f77bcf86cd799439011",
    "messages": [
      {
        "content": "¿Qué es el cáncer?",
        "answer": "El cáncer es un tipo de enfermedad...",
        "timestamp": "2025-10-06T20:30:00.000Z"
      }
    ],
    "createdAt": "2025-10-02T10:00:00.000Z",
    "updatedAt": "2025-10-02T10:00:00.000Z"
  }
]
```

**Errores:**
- `404 Not Found`: Si el código de usuario no existe

**Ejemplo:**
```http
GET /chats/user/codigo/TEST2025
```

### 4. Obtener Chat Específico

```http
GET /chats/:id
```

### 5. Enviar Mensaje (Usa IA con Streaming)

```http
POST /chats/:id/messages
Content-Type: application/json

{
  "content": "¿Qué es el cáncer?",
  "n": 5,
  "temperature": 0.7,
  "maxTokens": 128
}
```

**Parámetros:**
- `content` (string, requerido): Pregunta del usuario
- `n` (number, opcional): Número de mensajes previos para contexto (default: 5)
- `temperature` (number, opcional): Temperatura de la IA 0-2 (default: 0.7)
- `maxTokens` (number, opcional): Máximo de tokens (default: 128)

**Response:**
```json
{
  "content": "¿Qué es el cáncer?",
  "answer": "El cáncer es un tipo de enfermedad...",
  "timestamp": "2025-10-06T20:30:00.000Z"
}
```

**Nota:** Durante el procesamiento, el backend emite eventos WebSocket:
1. `ai-response-start` - Comienza
2. `ai-response-chunk` - Cada palabra (streaming)
3. `ai-response-end` - Termina

### 6. Obtener Mensajes de un Chat

```http
GET /chats/:id/messages
```

### 7. Limpiar Mensajes de un Chat

```http
DELETE /chats/:id/messages
```

### 8. Eliminar Chat

```http
DELETE /chats/:id
```

---

## 🗄️ Base de Datos

### Colección: Users

```javascript
{
  _id: ObjectId,
  nombre: String,
  rol: String, // "paciente" | "empleado" | "admin"
  chats: [ObjectId], // Referencias a chats
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: Chats

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Referencia a User
  messages: [
    {
      content: String,    // Pregunta del usuario
      answer: String,     // Respuesta de la IA
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📝 Ejemplos de Uso

### Ejemplo Completo: Crear Usuario, Chat y Mensaje con Streaming

#### 1. Crear un usuario

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María González",
    "rol": "paciente"
  }'
```

**Response:**
```json
{
  "id": "67d590919bdecea46c6499ca",
  "nombre": "María González",
  "rol": "paciente",
  "chats": [],
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z"
}
```

#### 2. Crear un chat para el usuario

```bash
curl -X POST http://localhost:3000/api/v1/chats \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "67d590919bdecea46c6499ca"
  }'
```

**Response:**
```json
{
  "id": "67d59123456789abcdef1234",
  "userId": "67d590919bdecea46c6499ca",
  "messages": [],
  "createdAt": "2025-10-06T10:05:00.000Z",
  "updatedAt": "2025-10-06T10:05:00.000Z"
}
```

#### 3. Conectar WebSocket (Frontend)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket');
});

// Escuchar inicio de respuesta
socket.on('ai-response-start', (data) => {
  console.log('🚀 AI started generating response');
});

// Escuchar chunks en tiempo real
socket.on('ai-response-chunk', (data) => {
  console.log('📝 Chunk:', data.chunk);
  // Agregar chunk a la UI
});

// Escuchar fin de respuesta
socket.on('ai-response-end', (data) => {
  console.log('✅ AI finished:', data.message);
});
```

#### 4. Enviar un mensaje al chat (REST)

```bash
curl -X POST http://localhost:3000/api/v1/chats/67d59123456789abcdef1234/messages \
  -H "Content-Type: application/json" \
  -d '{
    "content": "¿Cuáles son los síntomas del cáncer?",
    "n": 5,
    "temperature": 0.7,
    "maxTokens": 128
  }'
```

**Lo que sucede:**

1. Backend recibe el POST
2. Backend emite `ai-response-start` via WebSocket
3. Backend consume SSE del modelo de IA
4. Por cada chunk del modelo, backend emite `ai-response-chunk`
5. Frontend muestra chunks en tiempo real
6. Backend emite `ai-response-end` con mensaje completo
7. Backend responde al POST con el mensaje guardado

**Response:**
```json
{
  "content": "¿Cuáles son los síntomas del cáncer?",
  "answer": "Los síntomas del cáncer pueden incluir...",
  "timestamp": "2025-10-06T10:10:00.000Z"
}
```

#### 5. Obtener historial del chat

```bash
curl http://localhost:3000/api/v1/chats/67d59123456789abcdef1234/messages
```

---

## 🔄 Flujo de Trabajo

### Flujo Completo con Streaming

```
1. Usuario → Frontend
   Escribe mensaje: "¿Qué es el cáncer?"
   
2. Frontend → Backend (REST)
   POST /api/v1/chats/:id/messages
   
3. Backend → WebSocket
   Emite: 'ai-response-start'
   
4. Frontend ← WebSocket
   Muestra indicador: "Generando respuesta..."
   
5. Backend → Modelo IA (SSE)
   Consume: http://localhost:8000/api/v1/qa/stream
   
6. Modelo IA → Backend (SSE Stream)
   data: {"type":"stream_chunk","content":"El"}
   data: {"type":"stream_chunk","content":" cáncer"}
   data: {"type":"stream_chunk","content":" es"}
   ...
   
7. Backend → WebSocket (por cada chunk)
   Emite: 'ai-response-chunk' { chunk: "El " }
   Emite: 'ai-response-chunk' { chunk: "cáncer " }
   Emite: 'ai-response-chunk' { chunk: "es " }
   ...
   
8. Frontend ← WebSocket
   Muestra chunks en tiempo real:
   "El"
   "El cáncer"
   "El cáncer es"
   ...
   
9. Backend → MongoDB
   Guarda mensaje completo
   
10. Backend → WebSocket
    Emite: 'ai-response-end' { message: {...} }
    
11. Backend → Frontend (REST)
    Response 201: { content, answer, timestamp }
```

---

## 🔧 Configuración del main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar puerto
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
```

---

## 🔧 Configuración del app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ChatsModule } from './modules/chats/chats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    ChatsModule,
  ],
})
export class AppModule {}
```

---

## 🎯 Próximos Pasos

### Auth Module (Pendiente)

El módulo de autenticación se agregará posteriormente con:

- Registro de usuarios con código único
- Login con JWT
- Guards de protección de rutas
- Roles y permisos

La arquitectura actual está diseñada para integrar Auth sin modificar los módulos existentes.

---

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

### Testing WebSocket

Puedes probar WebSocket con herramientas como:

**1. Postman / Thunder Client**
- Crear conexión WebSocket: `ws://localhost:3000`
- Escuchar eventos: `ai-response-start`, `ai-response-chunk`, `ai-response-end`

**2. Browser Console**
```javascript
const socket = io('http://localhost:3000');

socket.on('connect', () => console.log('Connected'));
socket.on('ai-response-chunk', (data) => console.log('Chunk:', data.chunk));
```

**3. curl para SSE (directo al modelo)**
```bash
curl -N -H "Accept: text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"question":"Hola","temperature":0.7,"max_tokens":128,"history":[]}' \
  http://localhost:8000/api/v1/qa/stream
```

---

## 🐛 Solución de Problemas

### Error de Conexión a MongoDB

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solución:**
- Verifica que MongoDB esté corriendo: `mongod`
- Verifica la variable `MONGODB_URI` en `.env`

### Error al Consumir API de IA

```
Error: Failed to generate AI response
```

**Solución:**
- Verifica que el modelo de IA esté corriendo en `http://localhost:8000`
- Verifica que la variable `MODELO_IA` apunte a `/api/v1/qa/stream`
- Prueba el endpoint directamente: `curl http://localhost:8000/api/v1/qa/stream`
- Revisa los logs del servidor NestJS para más detalles

### WebSocket no Conecta

```
WebSocket connection failed
```

**Solución:**
- Verifica que el backend esté corriendo
- Verifica CORS: agrega tu origen en `CORS_ORIGINS`
- En producción, asegúrate de usar `wss://` (WebSocket Secure)
- Revisa la consola del navegador para errores

### Streaming no Funciona

```
No se ven los chunks en tiempo real
```

**Solución:**
- Verifica que el frontend esté escuchando los eventos correctos
- Abre la consola del navegador y busca logs de WebSocket
- Verifica que el modelo de IA esté enviando eventos SSE correctamente
- Revisa los logs del backend (debe mostrar "SSE Event: stream_chunk")

### Timeout en Respuestas Largas

```
Error: timeout of 60000ms exceeded
```

**Solución:**
- Aumenta `AI_TIMEOUT` en `.env` (default: 60000ms)
- Reduce `AI_MAX_TOKENS` para respuestas más cortas
- Verifica que el modelo de IA responda en tiempo razonable

---

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

## 👥 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

## 📝 Notas Adicionales

### Convenciones de Código

- **Código**: Inglés
- **Comentarios**: Español
- **Nombres de variables**: Descriptivos y en inglés
- **Nombres de métodos**: Verbos en inglés

### Buenas Prácticas Implementadas

✅ Validación de datos con DTOs
✅ Manejo de errores con excepciones de NestJS
✅ Separación de responsabilidades (SOLID)
✅ Código limpio y documentado
✅ Arquitectura escalable
✅ WebSocket para tiempo real
✅ Streaming SSE del modelo de IA
✅ Logging detallado para debugging

### Arquitectura de Streaming

**Backend consume SSE (Server-Sent Events):**
- El modelo de IA envía eventos SSE línea por línea
- Formato: `data: {"type":"stream_chunk","content":"..."}`
- El backend parsea y acumula la respuesta

**Backend emite WebSocket:**
- Convierte los eventos SSE a WebSocket
- Los clientes escuchan en tiempo real
- No necesitan implementar SSE, solo WebSocket

### Escalabilidad

Para producción, considera:

1. **Redis para WebSocket**: Múltiples instancias de backend
2. **Load Balancer**: Distribuir tráfico entre instancias
3. **Sticky Sessions**: Para WebSocket con load balancer
4. **Rate Limiting**: Limitar peticiones por usuario
5. **Caching**: Redis para respuestas frecuentes
6. **Monitoring**: Logs centralizados (ELK, Datadog)

### Seguridad

Para producción, implementar:

1. **JWT Authentication**: Proteger endpoints
2. **CORS restrictivo**: Solo orígenes específicos
3. **Rate Limiting**: Prevenir abuse
4. **Input Sanitization**: Prevenir XSS/injection
5. **HTTPS/WSS**: Conexiones seguras
6. **Environment Variables**: Nunca commit .env

---

## ❓ FAQ (Preguntas Frecuentes)

### ¿Por qué WebSocket y no solo SSE?

- **Backend → IA**: Usamos SSE porque el modelo lo provee así
- **Backend → Frontend**: Usamos WebSocket porque es más simple para el frontend y soporta bidireccional
- **Ventaja**: El backend actúa como traductor SSE → WebSocket

### ¿Puedo usar solo REST sin WebSocket?

Sí, pero no verás el streaming en tiempo real. La respuesta llegaría completa al final. Para una experiencia tipo ChatGPT, WebSocket es necesario.

### ¿Cómo escalo esto con múltiples instancias?

Para múltiples instancias de backend necesitas:
1. Redis Adapter para Socket.io
2. Sticky sessions en el load balancer
3. O usar un servidor WebSocket dedicado

### ¿Qué pasa si el modelo de IA no responde?

El sistema tiene timeout configurado (60 segundos). Si el modelo no responde, el backend emitirá un evento `error` via WebSocket y retornará un error HTTP.

### ¿Puedo cambiar el modelo de IA fácilmente?

Sí, solo necesitas:
1. Actualizar `MODELO_IA` en `.env`
2. Si el formato cambia, modificar `ai.service.ts`
3. Toda la lógica de negocio permanece igual

### ¿Funciona en producción?

Sí, pero recuerda:
- Usar `wss://` para WebSocket (SSL)
- Configurar CORS correctamente
- Agregar autenticación
- Implementar rate limiting

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0 con Streaming en Tiempo Real