# API ToutPharma — Express + SQLite
# trixie : glibc ≥ 2.38 requise par les binaires précompilés de sqlite3 v6.
FROM node:22-trixie-slim

WORKDIR /app
ENV NODE_ENV=production

# Dépendances d'abord (cache de layer)
COPY package*.json ./
RUN npm ci --omit=dev \
    # Les binaires natifs de sharp pour la plateforme du conteneur ne sont pas
    # toujours résolus par npm ci depuis un lockfile généré sur macOS.
    && npm install --no-save --include=optional sharp

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
