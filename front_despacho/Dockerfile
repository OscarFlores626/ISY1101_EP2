# ─────────────────────────────────────────────────────────────
# STAGE 1 — BUILD
# Node.js para instalar dependencias y compilar el bundle de React.
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos package.json y package-lock.json primero.
# Si solo cambia el código fuente (no las deps), Docker reutiliza
# la capa de node_modules sin reinstalar (optimización de capas).
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copiamos el resto del código fuente
COPY . .

# Variable de entorno para la URL del backend en producción.
# VITE_API_BASE_URL se inyecta en tiempo de build — Vite la embebe
# en el bundle estático. No es un secret, es una URL pública.
ARG VITE_API_BASE_URL=http://localhost
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Compilamos el proyecto: genera los archivos estáticos en /app/dist
RUN npm run build

# ─────────────────────────────────────────────────────────────
# STAGE 2 — RUNTIME
# nginx:alpine para servir los archivos estáticos.
# Esta imagen pesa ~25MB vs ~200MB de Node.js.
# ─────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Eliminamos la configuración default de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos SOLO el bundle compilado desde el stage de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx corre por defecto como root pero lo configuramos para
# usar el usuario nginx que ya viene en la imagen
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
