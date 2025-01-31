# Usa una imagen de Node.js como base
FROM node:22.13.0-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json (o yarn.lock si usas yarn)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto al directorio de trabajo en el contenedor
COPY . .

# Compila la aplicación
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Ejecuta la aplicación cuando el contenedor se inicia
CMD ["npm", "start"]