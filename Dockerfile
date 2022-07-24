FROM node:16.16.0 AS clean-node-api

WORKDIR /app

COPY ./package.json .

RUN npm set-script prepare ""
RUN npm install --omit=dev
