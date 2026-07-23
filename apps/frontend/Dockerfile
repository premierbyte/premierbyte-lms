FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

# Development stage
FROM base AS development
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
COPY . .
RUN npm run build
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["npm", "run", "start"]
