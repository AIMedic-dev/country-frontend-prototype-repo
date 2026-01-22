# 📊 API de Analytics - Backend Country

Documentación completa de los endpoints de analytics del backend. Estos endpoints permiten obtener estadísticas y análisis de las conversaciones de los usuarios con la IA.

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Autenticación](#autenticación)
- [Variables de Entorno](#variables-de-entorno)
- [Endpoints](#endpoints)
  - [1. Obtener Analítica General](#1-obtener-analítica-general)
  - [2. Obtener Analítica Individual por Usuario](#2-obtener-analítica-individual-por-usuario)
  - [3. Actualizar Cache Manualmente](#3-actualizar-cache-manualmente)
  - [4. Obtener Información de la Cache](#4-obtener-información-de-la-cache)
  - [5. Configurar Intervalo de Actualización](#5-configurar-intervalo-de-actualización)
- [Estructura de Respuestas](#estructura-de-respuestas)
- [Códigos de Estado HTTP](#códigos-de-estado-http)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Permisos y Roles](#permisos-y-roles)

---

## Introducción

El backend expone endpoints para consultar analítica de conversaciones de dos formas:

1. **Analítica General**: Estadísticas de todas las conversaciones (o filtradas por usuario)
2. **Analítica Individual**: Estadísticas específicas de un usuario individual

Los datos provienen de una API externa de analytics y se cachean en MongoDB para mejorar el rendimiento.

---

## Autenticación

Todos los endpoints requieren un **JWT Token** en el header `Authorization`:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Obtén el token haciendo login:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"codigo": "USER001"}'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan García",
    "rol": "empleado",
    "codigo": "USER001"
  }
}
```

---

## Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```env
# URL base de la API externa de analytics
ANALYTICS_API_URL=https://country-analytics-dceee2bhafg3d7bb.eastus-01.azurewebsites.net/analytics

# Timeout para consultas al API externo (en milisegundos)
ANALYTICS_API_TIMEOUT_MS=180000

# Intervalo de actualización automática de la cache (en minutos)
ANALYTICS_CACHE_UPDATE_INTERVAL_MINUTES=60
```

---

## Endpoints

### 1. Obtener Analítica General

Obtiene las estadísticas de conversaciones de todos los usuarios (o filtradas por un usuario específico).

#### Syntax

```http
GET /api/v1/analytics?mode=<cache|realtime>&userCode=<codigo>
Authorization: Bearer <JWT_TOKEN>
```

#### Parámetros Query

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `mode` | string | No | `cache` | Modo de consulta: `cache` (rápido, desde DB) o `realtime` (lento, API externa) |
| `userCode` | string | No | `all` | Código del usuario para filtrar. Si es `all` o no se envía, retorna todos |

#### Respuesta Exitosa (200 OK)

```json
{
  "chatId1": {
    "summary": "Conversación sobre síntomas de migraña, causas, tratamientos disponibles...",
    "topics": ["Migraña", "Cefalea", "Neurología", "Medicamentos"]
  },
  "chatId2": {
    "summary": "Discusión sobre diabetes tipo 2, control de glucosa, dieta...",
    "topics": ["Diabetes", "Glucosa", "Insulina", "Endocrinología"]
  }
}
```

#### Errores Posibles

**404 Not Found** - No hay datos disponibles:
```json
{
  "statusCode": 404,
  "message": "No hay analítica cacheada disponible. Use mode=realtime o ejecute la actualización de cache.",
  "error": "Not Found"
}
```

**400 Bad Request** - Usuario no encontrado:
```json
{
  "statusCode": 400,
  "message": "No se encontraron chats para el usuario con código: USER001",
  "error": "Bad Request"
}
```

#### Ejemplos

**Obtener analítica de todos (desde cache):**
```bash
curl -X GET "http://localhost:3000/api/v1/analytics?mode=cache" \
  -H "Authorization: Bearer $TOKEN"
```

**Obtener analítica en tiempo real:**
```bash
curl -X GET "http://localhost:3000/api/v1/analytics?mode=realtime" \
  -H "Authorization: Bearer $TOKEN"
```

**Filtrar por usuario (desde cache):**
```bash
curl -X GET "http://localhost:3000/api/v1/analytics?mode=cache&userCode=USER001" \
  -H "Authorization: Bearer $TOKEN"
```

**Filtrar por usuario (tiempo real):**
```bash
curl -X GET "http://localhost:3000/api/v1/analytics?mode=realtime&userCode=PATIENT123" \
  -H "Authorization: Bearer $TOKEN"
```

#### Notas Importantes

- **Mode `cache`**: Devuelve datos de MongoDB (rápido, ~100ms)
- **Mode `realtime`**: Consulta la API externa (lento, ~3 minutos de timeout)
- **Ambos modos son de solo lectura**: No modifican la cache
- La cache se actualiza automáticamente según el intervalo configurado o manualmente con `POST /api/v1/analytics/cache/update`

---

### 2. Obtener Analítica Individual por Usuario

Obtiene las estadísticas específicas de un usuario individual consultando directamente la API externa.

#### Syntax

```http
GET /api/v1/analytics/user/:codigo
Authorization: Bearer <JWT_TOKEN>
```

#### Parámetros Path

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `codigo` | string | Código único del usuario (ej: `USER001`, `PATIENT123`) |

#### Respuesta Exitosa (200 OK)

**A) Usuario con conversaciones:**
```json
{
  "696111ae36372edcb67bb7f7": {
    "summary": "La conversación giró en torno al cáncer de mama HER2 positivo (triple positivo), abarcando resonancia magnética, estadificación, tratamiento...",
    "topics": [
      "Cáncer de mama HER2 positivo",
      "Triple positivo",
      "Mastectomía",
      "Quimioterapia",
      "Terapia anti-HER2",
      "Tamoxifeno"
    ]
  }
}
```

**B) Usuario sin conversaciones:**
```json
{
  "696111c736372edcb67bb7fd": {
    "summary": "No hay conversaciones para este usuario.",
    "topics": []
  }
}
```

#### Errores Posibles

**404 Not Found** - Usuario no encontrado en el sistema:
```json
{
  "statusCode": 404,
  "message": "Usuario con código USER001 no encontrado",
  "error": "Not Found"
}
```

**502 Bad Gateway** - Usuario no encontrado en la API de analytics:
```json
{
  "detail": "User not found"
}
```

**503 Service Unavailable** - Timeout o error en la API de analytics:
```json
{
  "statusCode": 503,
  "message": "Timeout consultando analytics (180000ms)",
  "error": "Service Unavailable"
}
```

#### Ejemplos

**Obtener analítica de usuario:**
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/user/USER001" \
  -H "Authorization: Bearer $TOKEN"
```

**En JavaScript/TypeScript:**
```typescript
async function getUserAnalytics(codigo: string, token: string) {
  const response = await fetch(
    `http://localhost:3000/api/v1/analytics/user/${codigo}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

// Uso
const analytics = await getUserAnalytics('USER001', myToken);
console.log(analytics);
```

#### Casos de Uso

- Dashboard individual de paciente
- Reportes personalizados por usuario
- Seguimiento específico de temas tratados con un paciente
- Análisis detallado de conversaciones de un usuario

---

### 3. Actualizar Cache Manualmente

Fuerza una actualización de la cache desde la API externa. Normalmente el scheduler automático lo hace cada 60 minutos, pero este endpoint permite hacerlo manualmente.

#### Syntax

```http
POST /api/v1/analytics/cache/update
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "updateIntervalMinutes": 120
}
```

#### Body (Opcional)

```json
{
  "updateIntervalMinutes": 120
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `updateIntervalMinutes` | number | Intervalo en minutos para la próxima actualización automática |

#### Respuesta Exitosa (200 OK)

```json
{
  "message": "Cache actualizada exitosamente",
  "lastUpdated": "2025-01-22T15:30:45.123Z",
  "updateIntervalMinutes": 60,
  "totalChats": 42
}
```

#### Errores Posibles

**401 Unauthorized** - No autenticado:
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**403 Forbidden** - Sin permisos (solo admin puede actualizar):
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

**503 Service Unavailable** - Error consultando API de analytics:
```json
{
  "statusCode": 503,
  "message": "No se pudo obtener analytics (status 500)",
  "error": "Service Unavailable"
}
```

#### Ejemplos

**Actualizar cache con intervalo por defecto:**
```bash
curl -X POST "http://localhost:3000/api/v1/analytics/cache/update" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Actualizar cache y cambiar intervalo a 120 minutos:**
```bash
curl -X POST "http://localhost:3000/api/v1/analytics/cache/update" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"updateIntervalMinutes": 120}'
```

#### Notas Importantes

- **Requiere rol `admin`**: Solo administradores pueden forzar actualización
- **Modifica la cache**: A diferencia de los endpoints GET, este SÍ modifica los datos en MongoDB
- **Puede ser lento**: El timeout es de 180 segundos, la operación puede tomar un tiempo

---

### 4. Obtener Información de la Cache

Obtiene metadatos sobre la cache: cuándo se actualizó por última vez y cada cuánto se actualiza automáticamente.

#### Syntax

```http
GET /api/v1/analytics/cache/info
Authorization: Bearer <JWT_TOKEN>
```

#### Respuesta Exitosa (200 OK)

```json
{
  "lastUpdated": "2025-01-22T14:30:00.000Z",
  "updateIntervalMinutes": 60
}
```

#### Errores Posibles

**404 Not Found** - No hay información de cache:
```json
{
  "statusCode": 404,
  "message": "No hay información de cache disponible",
  "error": "Not Found"
}
```

#### Ejemplo

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/cache/info" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5. Configurar Intervalo de Actualización

Cambia el intervalo de actualización automática de la cache sin forzar una actualización inmediata.

#### Syntax

```http
PATCH /api/v1/analytics/cache/interval
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "minutes": 120
}
```

#### Body (Requerido)

```json
{
  "minutes": 120
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|-----------|
| `minutes` | number | Sí | Mínimo: 1, Máximo: sin límite |

#### Respuesta Exitosa (200 OK)

```json
{
  "message": "Intervalo de actualización configurado exitosamente",
  "updateIntervalMinutes": 120
}
```

#### Errores Posibles

**400 Bad Request** - Intervalo inválido:
```json
{
  "statusCode": 400,
  "message": "El intervalo debe ser al menos 1 minuto",
  "error": "Bad Request"
}
```

**403 Forbidden** - Sin permisos (solo admin):
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

#### Ejemplo

```bash
curl -X PATCH "http://localhost:3000/api/v1/analytics/cache/interval" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"minutes": 30}'
```

---

## Estructura de Respuestas

### Formato de Analytics

Cada entrada en la respuesta tiene este formato:

```typescript
{
  [chatId: string]: {
    summary: string;      // Resumen textual de la conversación
    topics: string[];     // Array de temas/tópicos tratados
  }
}
```

### Ejemplo Real

```json
{
  "507f1f77bcf86cd799439011": {
    "summary": "Conversación sobre síntomas de depresión, opciones de tratamiento, medicamentos antidepresivos, terapia psicológica...",
    "topics": [
      "Depresión",
      "Salud mental",
      "Antidepresivos",
      "Psicoterapia",
      "Ansiedad",
      "Medicamentos"
    ]
  },
  "507f1f77bcf86cd799439012": {
    "summary": "Discusión sobre nutrición, dieta balanceada, vitaminas, suplementos...",
    "topics": [
      "Nutrición",
      "Dieta",
      "Vitaminas",
      "Suplementos",
      "Alimentos saludables"
    ]
  }
}
```

---

## Códigos de Estado HTTP

| Código | Significado | Cuándo Ocurre |
|--------|------------|---------------|
| **200** | OK | Solicitud exitosa |
| **400** | Bad Request | Parámetros inválidos o usuario no encontrado |
| **401** | Unauthorized | Falta token JWT o token inválido |
| **403** | Forbidden | Usuario sin permisos (ej: rol requerido es admin) |
| **404** | Not Found | Usuario o recurso no encontrado |
| **502** | Bad Gateway | API externa retorna error |
| **503** | Service Unavailable | API externa caída, timeout o configuración faltante |

---

## Ejemplos Prácticos

### Ejemplo 1: Obtener Analítica Completa desde Cache

**Escenario**: Administrador quiere ver todas las conversaciones de forma rápida

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:3000/api/v1/analytics?mode=cache" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
{
  "507f1f77bcf86cd799439011": {
    "summary": "Síntomas de diabetes...",
    "topics": ["Diabetes", "Insulina", "Glucosa"]
  },
  "507f1f77bcf86cd799439012": {
    "summary": "Dolor de cabeza crónico...",
    "topics": ["Migraña", "Cefalea", "Analgésicos"]
  }
}
```

### Ejemplo 2: Ver Analítica de un Paciente Específico

**Escenario**: Empleado quiere ver todas las conversaciones que ha tenido un paciente

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:3000/api/v1/analytics/user/PATIENT_001" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
{
  "696111ae36372edcb67bb7f7": {
    "summary": "Cáncer de mama HER2 positivo...",
    "topics": ["Oncología", "Cáncer de mama", "Tratamiento"]
  }
}
```

### Ejemplo 3: Actualizar Cache Después de Cambio de Datos

**Escenario**: Admin detecta que la cache está desactualizada y la fuerza a actualizar

```bash
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST "http://localhost:3000/api/v1/analytics/cache/update" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"updateIntervalMinutes": 60}'
```

**Respuesta:**
```json
{
  "message": "Cache actualizada exitosamente",
  "lastUpdated": "2025-01-22T15:45:30.123Z",
  "updateIntervalMinutes": 60,
  "totalChats": 42
}
```

### Ejemplo 4: Verificar Cuándo Se Actualizó la Cache

**Escenario**: Empleado quiere saber si los datos son recientes

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:3000/api/v1/analytics/cache/info" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
{
  "lastUpdated": "2025-01-22T14:30:00.000Z",
  "updateIntervalMinutes": 60
}
```

---

## Permisos y Roles

### Matriz de Acceso

| Endpoint | GET /analytics | GET /analytics/user/:codigo | POST /cache/update | GET /cache/info | PATCH /cache/interval |
|----------|:-:|:-:|:-:|:-:|:-:|
| **paciente** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **empleado** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

**Leyenda:**
- ✅ Permitido
- ❌ Denegado (retorna 403 Forbidden)

---

## Flujos Típicos

### Flujo 1: Ver Analítica General

```
1. User hace login → obtiene JWT
2. User llama GET /api/v1/analytics?mode=cache
3. Backend busca cache en MongoDB
4. Retorna datos cacheados (rápido ~100ms)
```

### Flujo 2: Ver Analítica de Usuario Individual

```
1. User autenticado hace llamada GET /api/v1/analytics/user/USER001
2. Backend busca usuario por código en MongoDB
3. Obtiene userId del usuario
4. Consulta API externa con userId
5. Retorna analítica específica del usuario
```

### Flujo 3: Actualizar Cache Automática

```
1. Scheduler automático se ejecuta cada 60 minutos
2. Consulta API externa
3. Actualiza MongoDB con nuevos datos
4. Próxima actualización en 60 minutos
```

### Flujo 4: Forzar Actualización Manual

```
1. Admin hace llamada POST /api/v1/analytics/cache/update
2. Backend consulta API externa
3. Actualiza MongoDB
4. Retorna confirmación con fecha y número de chats
```

---

## Troubleshooting

### Problema: "No hay analítica cacheada disponible"

**Causa**: La cache nunca ha sido inicializada

**Solución**:
```bash
# Opción 1: Esperar a que el scheduler automático actualice (puede tomar hasta 60 min)
# Opción 2: Forzar actualización manual
curl -X POST "http://localhost:3000/api/v1/analytics/cache/update" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Opción 3: Usar mode=realtime en lugar de cache
curl -X GET "http://localhost:3000/api/v1/analytics?mode=realtime" \
  -H "Authorization: Bearer $TOKEN"
```

### Problema: "Timeout consultando analytics"

**Causa**: API externa está lenta o caída

**Solución**:
1. Verificar si la API externa está disponible
2. Aumentar `ANALYTICS_API_TIMEOUT_MS` en `.env`
3. Intentar más tarde
4. Usar cache si está disponible

### Problema: "Usuario con código XXX no encontrado"

**Causa**: El código de usuario no existe en MongoDB

**Solución**:
1. Verificar que el código sea correcto (case-sensitive)
2. Verificar que el usuario exista en la base de datos
3. Usar endpoint `/api/v1/users` para listar usuarios disponibles

---

**Última actualización**: 22 de Enero, 2026  
**Versión**: 1.0.0  
**Backend**: NestJS v10  
**Base de Datos**: MongoDB