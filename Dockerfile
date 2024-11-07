# First stage: Build the application
FROM node:20.4-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
ARG DEBUG_TOOLS=false
RUN echo debug is set $DEBUG_TOOLS
RUN npm ci
COPY . .
RUN npm run build

# Second stage: Create the final image
FROM node:20.4-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Exclude node_modules from chown and chmod
RUN find /app -not -path "/app/node_modules/*" -exec chown nextjs:nodejs {} + && \
    find /app -not -path "/app/node_modules/*" -exec chmod g+x {} +

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "docker-start"]
