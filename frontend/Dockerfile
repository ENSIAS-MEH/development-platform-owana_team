# ---- Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# ---- Build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for environment variables
ARG NEXT_PUBLIC_HOST_GATEWAY_API_URL=http://localhost:8080
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:8080
ARG NEXT_PUBLIC_ASSET_URL=http://localhost:8080

ENV NEXT_PUBLIC_HOST_GATEWAY_API_URL=$NEXT_PUBLIC_HOST_GATEWAY_API_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_ASSET_URL=$NEXT_PUBLIC_ASSET_URL

RUN npm run build

# ---- Production ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/next.config.mjs ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
