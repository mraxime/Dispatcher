# 1) Install dependencies only when needed
FROM node:21-alpine AS deps
WORKDIR /app

COPY package.json ./

# Add pnpm
RUN yarn global add pnpm
RUN pnpm install

#######################################################################################

# 2) Rebuild the source code only when needed
FROM node:21-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

#######################################################################################

# 3) Production image, copy all the files and run next
FROM node:21-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# New user and group to avoid root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# `next.config.js` is only needed if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json

# Correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
