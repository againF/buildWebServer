FROM node:20.17
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 9000
CMD yarn start