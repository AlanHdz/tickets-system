FROM node:20-alpine3.20 as base

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

FROM base as dev
ENV NODE_ENV=dev
RUN npm install
COPY . .