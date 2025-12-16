FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json* ./

# Instala herramientas de compilación necesarias para dependencias nativas
# Ejecuta npm (ci o install) y limpia caches para mantener la imagen pequeña
RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates python3 build-essential make g++ \
	&& if [ -f package-lock.json ]; then \
			 npm ci --only=production; \
		 else \
			 npm install --production; \
		 fi \
	&& apt-get purge -y --auto-remove build-essential make g++ \
	&& rm -rf /var/lib/apt/lists/*

# Copiar el resto de la aplicación
COPY . .

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
