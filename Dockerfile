FROM node:18.3.0

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json /home/node/app
RUN npm install
COPY --chown=node:node . /home/node/app

CMD npm run start
EXPOSE 3000
