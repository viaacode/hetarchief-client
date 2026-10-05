############################
# Build stage
############################
FROM node:24-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1
# disable color output, since jenkins doesn't support it in it's log viewer
ENV NO_COLOR=true
ARG DEBUG_TOOLS=false
RUN echo debug is set $DEBUG_TOOLS

# Install dependencies in a separate layer, so it can be reused when only source files change
COPY package.json package-lock.json ./
RUN npm pkg delete scripts.prepare
RUN npm ci --include=dev --no-audit --no-fund

COPY . .
RUN npm run build

############################
# Runtime stage
# Only contains the standalone server output (with the traced subset of node_modules),
# instead of the full source tree, all dev dependencies and the webpack build cache
############################
FROM node:24-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NO_COLOR=true
ENV PORT=3000
# The standalone server binds to $HOSTNAME, which kubernetes sets to the pod name
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/scripts/generate-env-config.js /app/scripts/copy-robots-txt-file.js /app/scripts/robots-enable-indexing.txt /app/scripts/robots-disable-indexing.txt ./scripts/

USER nextjs

EXPOSE 3000

# generate-env-config.js and copy-robots-txt-file.js write into ./public at container start
CMD ["sh", "-c", "node ./scripts/generate-env-config.js && node ./scripts/copy-robots-txt-file.js && exec node server.js"]
