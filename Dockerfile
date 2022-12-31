FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

CMD ["npx", "nodemon", "index.js"]