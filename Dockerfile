FROM node:16-alpine3.16 as build

ENV PORT=9000

WORKDIR /backend
RUN npm install -g pnpm

COPY . .
RUN pnpm install --prod

EXPOSE ${PORT}

RUN npm run build
CMD [ "npm", "start" ]