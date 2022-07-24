FROM node:16.16.0

WORKDIR /app

COPY ./package.json .

RUN npm set-script prepare ""
RUN npm install --omit=dev

COPY ./dist ./dist

EXPOSE 5000

CMD npm run start