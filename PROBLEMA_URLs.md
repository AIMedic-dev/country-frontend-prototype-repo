# 🔴 PROBLEMA ENCONTRADO: URLs Hardcodeadas en .env

## 📍 El Problema

El archivo `.env` tiene **URLs hardcodeadas a Azure en producción**:

```dotenv
# ❌ ACTUAL (Producción - Azure)
VITE_API_BASE_URL=https://backend-country.azurewebsites.net/api/v1
VITE_WEBSOCKET_URL=https://backend-country.azurewebsites.net

# ✅ Comentadas (Desarrollo - Localhost)
# VITE_API_BASE_URL=http://localhost:3000/api/v1
# VITE_WEBSOCKET_URL=http://localhost:3000
```

**Esto significa que cuando pruebas en local, el frontend sigue intentando conectar a Azure en lugar de tu backend local.**

---

## 🎯 Solución

### Para Desarrollo Local:

Actualiza el `.env`:

```dotenv
# Descomenta estas líneas para desarrollo local
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_WEBSOCKET_URL=http://localhost:3000

# Comenta estas para producción/Azure
# VITE_API_BASE_URL=https://backend-country.azurewebsites.net/api/v1
# VITE_WEBSOCKET_URL=https://backend-country.azurewebsites.net

VITE_AZURE_SPEECH_KEY="6GvgVObZHnw6rhJ6Z1CsynzU94JAqo1gDjuILJpPMwmdyGWwJpPuJQQJ99BLACYeBjFXJ3w3AAAYACOGuyWf"
VITE_AZURE_SPEECH_REGION="eastus"

VITE_ANALYTICS_API_URL=https://country-analytics-dceee2bhafg3d7bb.eastus-01.azurewebsites.net/analytics
VITE_ANALYTICS_API_TIMEOUT=180000
```

### Para Producción (Azure):

Mantén las URLs de Azure comentadas y descomenta cuando hagas deploy.

---

## 🔍 Flujo Actual

```
✅ Backend prueba en Postman/Swagger
   ↓ Funciona correctamente

❌ Frontend en navegador
   ↓ Busca la API en Azure (no en localhost)
   ↓ No encuentra el mensaje porque tu backend está en localhost
   ↓ Los datos no se guardan en BD
```

---

## 📋 Verificación Rápida

Después de cambiar el `.env`:

1. **Guarda el archivo `.env`**
2. **Reinicia el servidor Vite** (`npm run dev`)
3. **Abre el navegador Console (F12)**
4. Verifica que ahora vea en Network:
   ```
   POST http://localhost:3000/api/v1/chats/{chatId}/messages
   ```
   
   (En lugar de)
   ```
   POST https://backend-country.azurewebsites.net/api/v1/chats/{chatId}/messages
   ```

---

## 💡 Alternativa: Usar .env.local

Para evitar cambios accidentales, puedes crear un archivo `.env.local` (que no sube a Git):

```dotenv
# .env.local (NO subir a Git)
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_WEBSOCKET_URL=http://localhost:3000
```

Vite automáticamente prioriza `.env.local` sobre `.env`.

---

## 📂 Archivos Afectados

- [.env](.env) ← **Aquí está el problema**
- [src/shared/config/env.ts](src/shared/config/env.ts) ← Lee las variables
- [src/shared/services/api.service.ts](src/shared/services/api.service.ts) ← Usa la URL base

---

## 🚀 Próximos Pasos

1. Cambia el `.env` a localhost
2. Reinicia el servidor (`Ctrl+C` y `npm run dev`)
3. Envía un mensaje en el chat
4. Verifica en la BD que se guardó correctamente

**¿Necesitas que lo cambie automáticamente?**
