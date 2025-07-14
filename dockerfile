# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servidor web con Nginx
FROM nginx:alpine

# Copia el build generado desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# ✅ Copia tu configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
