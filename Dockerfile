# Install dependencies only when needed
FROM node:14-alpine AS deps
RUN mkdir -p /app
WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./prisma ./prisma/

RUN npm ci --omit=dev

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
RUN mkdir -p /app
WORKDIR /app


COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/prisma ./prisma/
COPY ./tsconfig.json .


COPY ./src ./src

RUN npm run build


# Production image, copy all the files and run
FROM node:14-alpine AS runner
RUN mkdir -p /app
WORKDIR /app


COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma/

RUN npm install pm2 -g


EXPOSE 8080
ENV PORT 8080

ENTRYPOINT ["pm2-runtime", "dist/src/server/server.js", "-i", "max"]
