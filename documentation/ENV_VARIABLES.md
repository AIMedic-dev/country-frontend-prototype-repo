# 🔧 Variables de Entorno - Configuración

## 📋 Variables Requeridas para Producción

### ✅ **CRÍTICAS** (Sin estas la aplicación NO funcionará)

#### 1. `VITE_API_BASE_URL`
- **Descripción**: URL base del backend API REST
- **Ejemplo desarrollo**: `http://localhost:3000/api/v1`
- **Ejemplo producción**: `https://backend-country.azurewebsites.net/api/v1`
- **Uso**: Todas las peticiones HTTP al backend
- **Valor por defecto**: `http://localhost:3000/api/v1` (solo desarrollo)

#### 2. `VITE_WEBSOCKET_URL`
- **Descripción**: URL del servidor WebSocket (Socket.IO) para chat en tiempo real
- **Ejemplo desarrollo**: `http://localhost:3000`
- **Ejemplo producción**: `https://backend-country.azurewebsites.net` o `wss://backend-country.azurewebsites.net`
- **Uso**: Conexión WebSocket para mensajes en tiempo real
- **Valor por defecto**: `http://localhost:3000` (solo desarrollo)
- **Nota**: En producción, usa `wss://` (WebSocket Secure) si tienes HTTPS

---

## 📋 Variables Opcionales

### 🔵 **Opcionales** (Tienen valores por defecto o son para funcionalidades específicas)

#### 3. `VITE_ANALYTICS_API_TIMEOUT`
- **Descripción**: Timeout en milisegundos para peticiones de analytics
- **Valor por defecto**: `180000` (3 minutos)
- **Uso**: Límite de tiempo para cargar analytics
- **Ejemplo**: `180000`

#### 4. `VITE_AZURE_SPEECH_KEY`
- **Descripción**: Clave de API de Azure Speech Services (solo si usas Speech-to-Text)
- **Valor por defecto**: `''` (vacío)
- **Uso**: Reconocimiento de voz
- **Ejemplo**: `tu-clave-de-azure-speech`

#### 5. `VITE_AZURE_SPEECH_REGION`
- **Descripción**: Región de Azure Speech Services (solo si usas Speech-to-Text)
- **Valor por defecto**: `''` (vacío)
- **Uso**: Región del servicio de Azure
- **Ejemplo**: `eastus`, `westus`, etc.

---

## ⚠️ Variables Deprecadas

### ❌ **Ya NO se usan** (el sistema ahora usa el backend)

#### `VITE_ANALYTICS_API_URL`
- **Estado**: ❌ Deprecada
- **Razón**: El sistema ahora usa el endpoint del backend (`/analytics`) en lugar del API externo directamente
- **Acción**: No es necesario configurarla

---

## 📝 Configuración en Azure App Service

### Método 1: Portal de Azure

1. Ve a tu **App Service** en Azure Portal
2. Navega a **Configuration** → **Application settings**
3. Agrega las siguientes variables:

```
VITE_API_BASE_URL = https://backend-country.azurewebsites.net/api/v1
VITE_WEBSOCKET_URL = https://backend-country.azurewebsites.net
```

### Método 2: Azure CLI

```bash
az webapp config appsettings set \
  --resource-group tu-resource-group \
  --name tu-app-service-name \
  --settings \
    VITE_API_BASE_URL="https://backend-country.azurewebsites.net/api/v1" \
    VITE_WEBSOCKET_URL="https://backend-country.azurewebsites.net"
```

### Método 3: GitHub Actions / CI/CD

Si usas GitHub Actions, agrega las variables en el workflow:

```yaml
env:
  VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
  VITE_WEBSOCKET_URL: ${{ secrets.VITE_WEBSOCKET_URL }}
```

Y configura los secrets en GitHub:
- Settings → Secrets and variables → Actions → New repository secret

---

## 🔍 Verificación

### Verificar que las variables están configuradas

1. **En desarrollo**: Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_WEBSOCKET_URL=http://localhost:3000
```

2. **En producción**: Verifica en la consola del navegador (F12):

```javascript
// Abre la consola y ejecuta:
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
console.log('WebSocket URL:', import.meta.env.VITE_WEBSOCKET_URL);
```

### Errores comunes

#### ❌ Error: "Network Error" o "Failed to fetch"
- **Causa**: `VITE_API_BASE_URL` no está configurada o es incorrecta
- **Solución**: Verifica que la URL del backend sea correcta y accesible

#### ❌ Error: "WebSocket connection failed"
- **Causa**: `VITE_WEBSOCKET_URL` no está configurada o es incorrecta
- **Solución**: 
  - Verifica que la URL sea correcta
  - En producción con HTTPS, usa `wss://` en lugar de `ws://` o `http://`

#### ❌ Error: "CORS error"
- **Causa**: El backend no tiene configurado CORS para tu dominio
- **Solución**: Agrega tu dominio frontend a `CORS_ORIGINS` en el backend

---

## 📋 Resumen Rápido

### Mínimo Requerido para Producción:

```env
VITE_API_BASE_URL=https://tu-backend.azurewebsites.net/api/v1
VITE_WEBSOCKET_URL=https://tu-backend.azurewebsites.net
```

### Con Speech-to-Text:

```env
VITE_API_BASE_URL=https://tu-backend.azurewebsites.net/api/v1
VITE_WEBSOCKET_URL=https://tu-backend.azurewebsites.net
VITE_AZURE_SPEECH_KEY=tu-clave-azure
VITE_AZURE_SPEECH_REGION=eastus
```

---

## 🔗 Archivos Relacionados

- **Configuración**: `src/shared/config/env.ts`
- **Servicio API**: `src/shared/services/api.service.ts`
- **WebSocket**: `src/modules/chat/hooks/useWebSocket.ts`

---

**Última actualización**: Enero 2026
