FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm config set registry http://registry.npmjs.org/
RUN npm config set strict-ssl false
RUN npm config set dns-result-order ipv4first
RUN npm install --loglevel verbose

COPY . .

RUN npx prisma generate
RUN npm run build

# --- Production Role: API ---
FROM node:18 AS api
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000
CMD ["npm", "run", "start:prod"]

# --- Production Role: Worker ---
FROM node:18 AS worker
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["node", "dist/worker.js"]
