FROM node:20.4-alpine AS runner
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
ARG DEBUG_TOOLS=false
RUN echo debug is set $DEBUG_TOOLS
RUN npm pkg delete scripts.prepare
RUN npm ci
RUN echo NEXT_TELEMETRY_DISABLED = $NEXT_TELEMETRY_DISABLED
RUN echo NODE_ENV = $NODE_ENV
RUN echo PORT = $PORT
RUN echo CLIENT_URL = $CLIENT_URL
RUN echo SSUM_EDIT_ACCOUNT_URL = $SSUM_EDIT_ACCOUNT_URL
RUN echo PROXY_URL = $PROXY_URL
RUN echo DEBUG_TOOLS = $DEBUG_TOOLS
RUN echo ZENDESK_KEY = $ZENDESK_KEY
RUN echo FLOW_PLAYER_TOKEN = $FLOW_PLAYER_TOKEN
RUN echo FLOW_PLAYER_ID = $FLOW_PLAYER_ID
RUN echo GOOGLE_TAG_MANAGER_ID = $GOOGLE_TAG_MANAGER_ID
RUN echo ENABLE_GOOGLE_INDEXING = $ENABLE_GOOGLE_INDEXING
RUN npm run build

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN chown -R nextjs:nodejs /app &&\
  chmod -R g+x /app

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "docker-start"]
