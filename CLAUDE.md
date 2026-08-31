# CLAUDE.md — Frontend country (chat clínico en tiempo real)

> **Hereda** el contexto de `../CLAUDE.md` (proyecto **country**: mapa de repos, cómo
> encajan, estado) y del nivel **AIMEDIC** (OpenTofu, `us-east-2`, español). Esto solo
> añade lo **específico de este frontend**.

## Qué es y stack
SPA del chat clínico en tiempo real "country". **Vite 6 + React 19 + TypeScript**,
**react-router-dom v7**. **NO es Next.js** (aunque hay restos legacy `src/app/` + `'use
client'` que NO aplican). Build `tsc -b && vite build` → **`dist/`**, servido estático por
**S3 + CloudFront** (y `dockerfile`/Nginx legacy). Habla con el **backend NestJS**.

## Cómo consume el backend
- **Tiempo real (socket.io-client)**: `src/modules/chat/hooks/useWebSocket.ts`
  (`VITE_WEBSOCKET_URL`). Escucha `ai-response-start/chunk/end`, `error`; **el mensaje se
  envía por REST**, la respuesta llega en streaming por el socket. Render en `ChatView`
  (mensaje optimista) + `MessageBubble` (markdown).
- **Datos (REST/axios)**: `src/shared/services/api.service.ts` (axios singleton,
  `VITE_API_BASE_URL`, Bearer desde localStorage, 401→logout) + services por dominio
  (`auth`, `chat`, `statistics`, `admin`). ⚠️ **Apollo/GraphQL son deps MUERTAS** (0 imports)
  — no usar GraphQL.

## Estructura y estilos
- **Feature-first**: `src/modules/{auth,chat,statistics,admin}/` (`components/hooks/services/
  types/views/context/` + barrel). Compartido en `src/shared/`. Router en `src/router/`.
- **⚠️ Legacy a ignorar** (no es la verdad): `src/app/` (Next-style, `providers.tsx` vacío),
  `src/components/{login,register}`, y archivos basura en la raíz.
- **Estilos = CSS Modules** (`*.module.css`) + tokens `--ds-*` de `src/styles/variables.css`
  (paleta AIMEDIC `#0E3192`/`#42A2CA`). ⚠️ **Tailwind está roto/muerto** (no registrado en
  `vite.config.ts`, `@import` comentado): las clases Tailwind en JSX **no estilan**. Usar CSS
  Modules. Texto en **español** (sin i18n).
- Libs: `react-markdown` (respuesta IA), `recharts`+`d3-cloud` (analítica), Azure Speech
  (voz, `es-ES`). Hotjar + GTM.

## Auth
Login **por `codigo`** → `POST /auth/login` → token en **localStorage** (`auth_token`/
`auth_user`). Guards de ruta con `ProtectedRoute` (roles `paciente/empleado/admin`).

## Env vars y ⚠️ seguridad
`VITE_API_BASE_URL`, `VITE_WEBSOCKET_URL`, `VITE_ANALYTICS_API_URL`, `VITE_AZURE_SPEECH_KEY`,
`VITE_AZURE_SPEECH_REGION`. **🔴 El `.env` está TRACKEADO en git con `VITE_AZURE_SPEECH_KEY`
en claro** (y `.gitignore` no lo ignora). Además todo `VITE_*` se hornea en el bundle
(público). Pendiente: sacar `.env` de git (`git rm --cached` + gitignore) y rotar la key
(idealmente proxear Azure Speech por el backend, no key en el cliente).

## Comandos y deploy
```bash
npm install && npm run dev   # vite
npm run build                # -> dist/
npm run lint
```
CI `.github/workflows/aws-deploy.yml`: push a `main` → `vite build` → `s3 sync ./dist
s3://aimedic-country-frontend` → invalidación CloudFront (OIDC, us-east-2). Dominio previsto:
**pacientes.aimedic.com.co**. Los push de solo docs/agents **no redespliegan** (`paths-ignore`).

## Agents de este repo (`.claude/agents/`)
Read-only, se **auto-delegan por su `description`**; complementan a los globales y a los
transversales del proyecto (`../.claude/agents/`). **Delegación automática:**
- Toco el chat en tiempo real (`src/modules/chat/hooks/useWebSocket.ts`, `ChatView`,
  `MessageBubble`, tipos de eventos) → **realtime-guard**.
- Toco `api.service.ts` o los `*.service.ts`, o agrego una llamada al backend →
  **api-service-guard** (alinea el contrato REST; nada de Apollo).
- Toco `vite.config.ts`, el router, la estructura de módulos o estilos → **spa-conventions-guard**
  (Vite/no-Next, CSS Modules/no-Tailwind, ignorar legacy).
- Toco auth, token, `ProtectedRoute`, `VITE_*`/`.env` → **auth-security-guard** (incluye la
  fuga del `.env`).
