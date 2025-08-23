FROM node:23-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV CI=true
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY . .

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile --filter frontend...
WORKDIR /app/frontend
RUN pnpm run build

FROM node:23-alpine AS production
ARG NODE_ENV=production
ARG DOMAIN=localhost

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=${NODE_ENV}
ENV DOMAIN=${DOMAIN}


RUN corepack enable
# minimal runtime: serve for static files
RUN npm install -g serve
# curl used by HEALTHCHECK
RUN apk add --no-cache curl

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --prod --frozen-lockfile --filter frontend...

# copy only built static files from the builder
COPY --from=build /app/frontend/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["curl", "-f", "http://localhost:8080"]