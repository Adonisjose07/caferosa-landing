FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./

# Instala herramientas de compilación necesarias para dependencias nativas
# Ejecuta npm (ci o install) y limpia caches para mantener la imagen pequeña
RUN npm install

# Copiar el resto de la aplicación
COPY . .

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
