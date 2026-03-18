FROM node:18-slim

WORKDIR /app

# 清理 npm 缓存并设置 registry
RUN npm config set registry https://registry.npmjs.org/ && \
    npm cache clean --force

COPY package.json ./
RUN rm -rf node_modules package-lock.json && \
    npm install --production

COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
