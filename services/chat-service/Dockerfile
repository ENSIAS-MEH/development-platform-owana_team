FROM node:20-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8085

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8085/health || exit 1

CMD ["node", "src/server.js"]
