FROM node:22-alpine AS build

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install --no-frozen-lockfile; fi

COPY . .
RUN pnpm run build

FROM alpine:3.21 AS rename-noreplace-helper

RUN apk add --no-cache build-base
WORKDIR /build
COPY scripts/rename-noreplace.c ./rename-noreplace.c
RUN cc -O2 -Wall -Wextra -o rename-noreplace rename-noreplace.c

FROM node:22-alpine AS stager

WORKDIR /app
RUN apk add --no-cache util-linux
COPY scripts/stage-static-release.mjs ./scripts/stage-static-release.mjs
COPY --from=rename-noreplace-helper /build/rename-noreplace ./scripts/rename-noreplace
ENV CABADRIVE_RENAME_NOREPLACE_HELPER=/app/scripts/rename-noreplace
COPY --from=build /app/dist /candidate

CMD ["sh", "-c", "set -eu; if [ -e /legacy-handoff/current ] || [ -L /legacy-handoff/current ]; then exec node /app/scripts/stage-static-release.mjs stage --state /state --candidate /candidate --legacy /legacy-handoff/current; else exec node /app/scripts/stage-static-release.mjs stage --state /state --candidate /candidate; fi"]

FROM nginx:1.29-alpine AS runtime

LABEL com.cabadrive.release-state-runtime="true"

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
