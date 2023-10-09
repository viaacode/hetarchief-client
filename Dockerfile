FROM node:20.4-alpine AS runner
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
ARG DEBUG_TOOLS=false
RUN echo debug is set $DEBUG_TOOLS
RUN npm pkg delete scripts.prepare
RUN npm ci

# use the slower babel compiler that is compatible with the linux build pod https://stackoverflow.com/questions/69816589/next-failed-to-load-swc-binary
# RUN echo "{\"presets\": [\"next/babel\"]}" >> "/app/.babelrc"
RUN npm run build

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
RUN chown nextjs:nodejs /app

RUN cp ./scripts/next-config-to-env-file.js ./

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "docker-start"]
