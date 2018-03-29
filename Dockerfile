FROM node:carbon

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]
