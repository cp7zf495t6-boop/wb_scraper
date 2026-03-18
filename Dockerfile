# Simple Node.js backend for Wildberries scraper
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY server.js ./

ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "server.js"]
