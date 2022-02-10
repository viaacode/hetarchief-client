# Install dependencies only when needed
FROM node:gallium-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# --unsafe-perm needed to install sharp native package. Otherwise we get this error:
#		npm ERR! code 1
#		npm ERR! path /home/jenkins/agent/workspace/hetarchief_client_PR-102/node_modules/sharp
#		npm ERR! command failed
#		npm ERR! command sh -c (node install/libvips && node install/dll-copy && prebuild-install) || (node install/can-compile && node-gyp rebuild && node install/dll-copy)
#		npm ERR! sharp: Are you trying to install as a root or sudo user? Try again with the --unsafe-perm flag
#		npm ERR! sharp: Please see https://sharp.pixelplumbing.com/install for required dependencies
#		npm ERR! sharp: Installation error: EACCES: permission denied, mkdir '/root/.npm'
RUN npm ci --ignore-scripts --unsafe-perm

# Rebuild the source code only when needed
FROM node:gallium-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM node:gallium-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
