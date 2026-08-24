# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# URLs del backend (se hornean en build: VITE_* es estático en Vite)
ARG VITE_API_BASE_URL
ARG VITE_WEBSOCKET_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WEBSOCKET_URL=$VITE_WEBSOCKET_URL

RUN npm run build

# Etapa 2: Servidor web con Nginx
FROM nginx:alpine

# Copia el build generado desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# ✅ Copia tu configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
