FROM oven/bun:alpine AS builder
WORKDIR /app

ENV NODE_ENV production

COPY package.json ./
RUN bun install

COPY . .
RUN bun build src/app.ts --outdir=./dist --target=bun --minify


FROM oven/bun:alpine AS runner
WORKDIR /app

ENV PORT 3010
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

# Create a non-root user and group to run the app
RUN addgroup --system --gid 1001 support && adduser --system --uid 1001 support

# Copy necessary files
COPY --from=builder --chown=support:support /app/dist ./

USER support

EXPOSE 3010
CMD ["bun", "app.js"]
