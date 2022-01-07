# Install dependencies only when needed
FROM node:gallium-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:gallium-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN   npm run build-storybook 
# Production image, copy all the files and run next
FROM node:gallium-alpine AS runner
WORKDIR /app


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --chown=1001:1001 .storybook .storybook
COPY --chown=1001:1001 --from=builder /app/storybook-static ./public
COPY --chown=1001:1001 --from=builder /app/node_modules ./node_modules
COPY --chown=1001:1001 --from=builder /app/package.json ./package.json
COPY --chown=1001:1001 src src
USER nextjs

EXPOSE 6006

CMD ["npm","run","storybook"]
