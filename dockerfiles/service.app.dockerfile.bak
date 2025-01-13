# Stage 1: Building the app
FROM node:22 AS deps
RUN npm install -g pnpm

WORKDIR /app
COPY package*json ./
RUN pnpm install

# Stage 2: Building the app
FROM node:22 as builder
RUN npm install -g pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./ ./
RUN ls -l
RUN pnpm run build

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
