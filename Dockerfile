FROM node:10-alpine
RUN npm install webpack -g

WORKDIR /server

COPY . /server
RUN npm install
RUN npm audit fix --force

EXPOSE 3000
CMD [ "npm", "start" ]
