# Stage 1: Building the app
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable

#RUN npm install -g pnpm
COPY package*json ./
RUN pnpm install

COPY ./ ./
RUN pnpm run build

RUN ls -l /app/

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

RUN corepack enable
RUN pnpm install --prod


EXPOSE 3000
CMD ["pnpm", "start"]

# Stage 3: Serve the application using a minimal image
#FROM node:22
#RUN npm install -g pnpm
#WORKDIR /app
#COPY --from=builder /app/.next ./.next
#COPY --from=builder /app/public ./public
#COPY --from=builder /app/package.json ./package.json
#COPY --from=builder /app/node_modules ./node_modules

# Exoose the port
#EXPOSE 3000

# Run the application
#CMD ["pnpm", "start"]
