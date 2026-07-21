# API ToutPharma — Express + SQLite
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production

# Dépendances d'abord (cache de layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Code
COPY server.js ./
COPY lib ./lib

# Données persistantes (base SQLite + uploads) montées en volumes
RUN mkdir -p /app/data /app/uploads/orders && chown -R node:node /app
ENV DB_PATH=/app/data/database.sqlite
USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://localhost:3001/api/status').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
