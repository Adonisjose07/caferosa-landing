FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./

# Instala herramientas de compilación necesarias para dependencias nativas
# Ejecuta npm (ci o install) y limpia caches para mantener la imagen pequeña
RUN if [ -f package-lock.json ]; then \
			npm ci --only=production; \
		else \
			npm install --production; \
		fi

# Copiar el resto de la aplicación
COPY . .

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
