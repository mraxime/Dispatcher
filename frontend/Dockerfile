FROM node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install -g pnpm@latest
COPY package.json ./
RUN pnpm install

COPY . .
RUN npm run build


FROM node:22-alpine AS runner
WORKDIR /app

ENV PORT 3000
ENV HOSTNAME 0.0.0.0
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# New user and group to avoid root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static .next/static

# Necessary files to run drizzle migration
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./

USER nextjs

EXPOSE 3000
CMD npm run db:migrate && node server.js
