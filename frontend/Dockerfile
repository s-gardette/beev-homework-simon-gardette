FROM node:20-alpine AS base

RUN npm install -g pnpm
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN pnpm fetch

COPY . .
RUN pnpm install -r

WORKDIR /app/frontend
RUN pnpm run build

RUN npm install -g serve
EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]