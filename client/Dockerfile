FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Build-time variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY . .

# Next.js build
RUN npm run build

FROM node:18 AS runner
WORKDIR /app

ENV NODE_ENV production

# Standalone build copy
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
