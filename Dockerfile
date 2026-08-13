FROM node:20-bookworm-slim AS frontend-builder

WORKDIR /app
COPY Frontend/package*.json ./
RUN npm ci
COPY Frontend ./
ARG VITE_BASE_URL=
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app
COPY Backend/package*.json ./
RUN npm ci --omit=dev
COPY Backend ./
COPY --from=frontend-builder /app/dist ./public

ENV NODE_ENV=production \
    NODE_OPTIONS=--max-old-space-size=384

USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:4000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
