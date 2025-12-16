FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar cache de Docker
COPY package*.json ./

RUN npm install --production

# Copiar el resto de la aplicación
COPY . .

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
