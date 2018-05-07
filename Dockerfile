FROM node:carbon

ARG PORT=5000

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE $PORT

CMD [ "npm", "start" ]
