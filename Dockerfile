FROM node:20.3.1-alpine3.18

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Expose port
EXPOSE 8080

RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]

