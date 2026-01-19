# 📊 Sistema de Analytics - Documentación

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Acceso y Permisos](#-acceso-y-permisos)
- [Configuración](#️-configuración)
- [Uso desde el Frontend](#-uso-desde-el-frontend)
- [API Externa](#-api-externa)
- [Filtrado por Usuario](#-filtrado-por-usuario)
- [Componentes Disponibles](#-componentes-disponibles)
- [Solución de Problemas](#-solución-de-problemas)

---

## 🎯 Descripción General

El sistema de **Analytics** permite visualizar estadísticas y análisis de las conversaciones de los usuarios con el asistente de IA. Proporciona:

- **Temas más comunes** discutidos en las conversaciones
- **Palabras más frecuentes** en los temas
- **Resúmenes** de cada conversación
- **Estadísticas generales** (total de conversaciones, temas únicos, etc.)
- **Filtrado por usuario** para ver estadísticas específicas

---

## 🔐 Acceso y Permisos

### Roles con Acceso

Solo los siguientes roles pueden acceder a la página de analytics:

- ✅ **`empleado`** (Colaborador)
- ✅ **`admin`** (Administrador)
- ❌ **`paciente`** (sin acceso)

### Cómo Acceder

1. **Desde el Sidebar del Chat:**
   - Los usuarios con rol `empleado` o `admin` verán un botón de **analytics** (ícono de gráfico) en la tarjeta de usuario
   - Al hacer clic, navegarán a `/analytics`

2. **URL Directa:**
   ```
   http://localhost:5173/analytics
   ```

3. **Navegación Programática:**
   ```tsx
   import { useNavigate } from 'react-router-dom';
   
   const navigate = useNavigate();
   navigate('/analytics');
   ```

### Protección de Rutas

La ruta está protegida en `AppRouter.tsx`:

```tsx
<Route
  path="/analytics"
  element={
    <ProtectedRoute requiredRole="empleado">
      <StatisticsPage />
    </ProtectedRoute>
  }
/>
```

**Nota:** Aunque el `ProtectedRoute` solo requiere `empleado`, la página `StatisticsPage` también permite acceso a `admin` mediante validación adicional.

---

## ⚙️ Configuración

### Variables de Entorno

El sistema requiere la siguiente variable de entorno:

```env
VITE_ANALYTICS_API_URL=https://country-analytics-dceee2bhafg3d7bb.eastus-01.azurewebsites.net/analytics
VITE_ANALYTICS_API_TIMEOUT=180000
```

**Ubicación:** Archivo `.env` en la raíz del proyecto

### Proxy de Desarrollo

En desarrollo, Vite configura un proxy para evitar problemas de CORS:

```ts
// vite.config.ts
proxy: {
  '/api/analytics': {
    target: 'https://country-analytics-dceee2bhafg3d7bb.eastus-01.azurewebsites.net',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/analytics/, '/analytics'),
    secure: true,
  },
}
```

**Uso en desarrollo:**
- El frontend puede llamar a `/api/analytics` y Vite lo redirige al servidor externo

---

## 💻 Uso desde el Frontend

### Hook `useStatistics`

El hook principal para obtener estadísticas:

```tsx
import { useStatistics } from '@/modules/statistics/hooks/useStatistics';

const { data, isLoading, error, refetch } = useStatistics({ 
  userCode: 'USER001' // Opcional: filtrar por código de usuario
});
```

**Parámetros:**
- `userCode` (opcional): Código del usuario para filtrar estadísticas. Si es `undefined` o `'all'`, muestra todas las conversaciones.

**Retorno:**
- `data`: Objeto `StatisticsData` con todas las estadísticas
- `isLoading`: Estado de carga
- `error`: Mensaje de error si ocurre
- `refetch`: Función para recargar los datos

### Ejemplo Completo

```tsx
import { useState } from 'react';
import { useStatistics } from '@/modules/statistics/hooks/useStatistics';
import { TopicsChart } from '@/modules/statistics/components/TopicsChart/TopicsChart';

export const MyAnalyticsComponent = () => {
  const [selectedUserCode, setSelectedUserCode] = useState<string>('all');
  
  const { data, isLoading, error, refetch } = useStatistics({ 
    userCode: selectedUserCode === 'all' ? undefined : selectedUserCode 
  });

  if (isLoading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <select 
        value={selectedUserCode} 
        onChange={(e) => setSelectedUserCode(e.target.value)}
      >
        <option value="all">Todos los usuarios</option>
        <option value="USER001">Usuario 001</option>
        <option value="USER002">Usuario 002</option>
      </select>

      {data && (
        <>
          <p>Total de conversaciones: {data.stats.totalConversations}</p>
          <TopicsChart data={data.topicsData} />
        </>
      )}
    </div>
  );
};
```

---

## 🌐 API Externa

### Endpoint

El sistema consume un API externo de Azure:

```
GET https://country-analytics-dceee2bhafg3d7bb.eastus-01.azurewebsites.net/analytics
```

### Formato de Respuesta

El API retorna un objeto donde cada clave es un `chatId`:

```json
{
  "chatId1": {
    "summary": "Resumen de la conversación...",
    "topics": ["tema1", "tema2", "tema3"]
  },
  "chatId2": {
    "summary": "Otra conversación...",
    "topics": ["tema2", "tema4"]
  }
}
```

### Transformación de Datos

El servicio `statistics.service.ts` transforma estos datos en:

- **Temas ordenados por frecuencia** (top 20)
- **Palabras más frecuentes** (top 30)
- **Estadísticas generales** (total conversaciones, temas únicos, etc.)
- **Resúmenes** de cada conversación

---

## 🔍 Filtrado por Usuario

### Cómo Funciona

1. **Sin filtro (`userCode: undefined`):**
   - Muestra estadísticas de **todas las conversaciones**

2. **Con filtro (`userCode: 'USER001'`):**
   - Obtiene los chats del usuario mediante: `GET /chats/user/codigo/USER001`
   - Filtra los resúmenes para incluir solo esos chats
   - Recalcula estadísticas basadas en los datos filtrados

### Ejemplo de Uso

```tsx
// Mostrar todas las conversaciones
const { data } = useStatistics();

// Filtrar por usuario específico
const { data } = useStatistics({ userCode: 'USER001' });
```

---

## 🧩 Componentes Disponibles

### 1. `StatisticsView`

Componente principal que renderiza toda la vista de analytics:

```tsx
import { StatisticsView } from '@/modules/statistics/views/StatisticsView';

<StatisticsView />
```

**Incluye:**
- Header con selector de pacientes
- Tarjetas de estadísticas
- Gráfica de temas
- Nube de palabras
- Resumen de interacciones

### 2. `TopicsChart`

Gráfica de barras con los temas más comunes:

```tsx
import { TopicsChart } from '@/modules/statistics/components/TopicsChart/TopicsChart';

<TopicsChart data={data.topicsData} />
```

### 3. `WordCloudChart`

Nube de palabras con las palabras más frecuentes:

```tsx
import { WordCloudChart } from '@/modules/statistics/components/WordCloudChart/WordCloudChart';

<WordCloudChart data={data.wordsData} />
```

### 4. `StatsCards`

Tarjetas con estadísticas generales:

```tsx
import { StatsCards } from '@/modules/statistics/components/StatsCards/StatsCards';

<StatsCards
  stats={data.stats}
  topicsData={data.topicsData}
  painScaleData={data.painScaleData}
  symptomsData={data.symptomsData}
/>
```

### 5. `SummarySection`

Sección con resúmenes de conversaciones:

```tsx
import { SummarySection } from '@/modules/statistics/components/SummarySection/SummarySection';

<SummarySection 
  summaries={data.summaries} 
  totalConversations={data.stats.totalConversations} 
/>
```

### 6. `AnalyticsHeader`

Header con selector de pacientes:

```tsx
import { AnalyticsHeader } from '@/modules/statistics/components/AnalyticsHeader/AnalyticsHeader';

<AnalyticsHeader 
  selectedPatient={selectedUserCode}
  onPatientChange={handleUserCodeChange}
/>
```

---

## 🛠️ Solución de Problemas

### Error: "La URL del API de analytics no está configurada"

**Causa:** Falta la variable de entorno `VITE_ANALYTICS_API_URL`

**Solución:**
1. Crear archivo `.env` en la raíz del proyecto
2. Agregar: `VITE_ANALYTICS_API_URL=https://country-analytics-dceee2bhafg3d7bb.eastus-01.azurewebsites.net/analytics`
3. Reiniciar el servidor de desarrollo

### Error: "No tienes permisos para acceder a las estadísticas"

**Causa:** El usuario no tiene rol `empleado` o `admin`

**Solución:**
- Verificar que el usuario tenga el rol correcto en la base de datos
- Solo usuarios con rol `empleado` o `admin` pueden acceder

### Error: "Error de red: No se pudo conectar con el servidor de analytics"

**Causa:** Problema de conexión o el servidor está caído

**Solución:**
1. Verificar conexión a internet
2. Verificar que el servidor de analytics esté disponible
3. Revisar la URL en `VITE_ANALYTICS_API_URL`

### Error: "No se encontraron chats para el código: USER001"

**Causa:** El código de usuario no existe o no tiene chats

**Solución:**
- Verificar que el código de usuario sea correcto
- Verificar que el usuario tenga conversaciones en la base de datos

### Timeout en la carga

**Causa:** El servidor tarda demasiado en responder

**Solución:**
- Aumentar `VITE_ANALYTICS_API_TIMEOUT` (default: 180000ms = 3 minutos)
- Verificar la carga del servidor de analytics

---

## 📝 Notas Adicionales

### Configuración de Límites

Los límites de datos se pueden ajustar en `statistics.service.ts`:

```ts
const ANALYTICS_CONFIG = {
  TOP_TOPICS_LIMIT: 20,      // Top 20 temas
  TOP_WORDS_LIMIT: 30,       // Top 30 palabras
  MIN_WORD_LENGTH: 3,        // Longitud mínima de palabras
};
```

### Datos No Disponibles

Actualmente, el API no proporciona:
- **Escala de dolor** (`painScaleData`): Array vacío
- **Síntomas** (`symptomsData`): Array vacío

Estos campos están preparados para futuras implementaciones.

---

## 🔗 Archivos Relacionados

- **Ruta:** `src/router/AppRouter.tsx`
- **Página:** `src/pages/StatisticsPage.tsx`
- **Vista:** `src/modules/statistics/views/StatisticsView.tsx`
- **Hook:** `src/modules/statistics/hooks/useStatistics.ts`
- **Servicio:** `src/modules/statistics/services/statistics.service.ts`
- **Tipos:** `src/modules/statistics/types/statistics.types.ts`
- **Configuración:** `src/shared/config/env.ts`
- **Vite Config:** `vite.config.ts`

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0
