FROM node:node:24-alpine AS runner
#node:lts-alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV production
COPY . .
ARG DEBUG_TOOLS=false
RUN echo debug is set $DEBUG_TOOLS
RUN npm pkg delete scripts.prepare
RUN npm ci
RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Exclude node_modules from chown and chmod
RUN find /app -not -path "/app/node_modules/*" -exec chown nextjs:nodejs {} + && \
    find /app -not -path "/app/node_modules/*" -exec chmod g+x {} +

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "docker-start"]
