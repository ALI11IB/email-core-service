FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install -g ts-node typescript && npm ci
COPY . .
RUN chmod +x ./wait-for-it.sh
EXPOSE 3000
CMD ["ts-node", "src/index.ts"]