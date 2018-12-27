FROM node:10.14.2-alpine

WORKDIR /app
COPY package.json /app
RUN npm install --production
COPY . /app

CMD npm run start
EXPOSE 4000
