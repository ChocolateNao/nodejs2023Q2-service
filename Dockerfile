FROM node:lts-alpine3.19

WORKDIR /app

COPY package*.json .
RUN npm ci && npm cache clean --force

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "run", "start:migrate:dev" ]