# development stage
FROM node:lts-alpine AS dev-stage
RUN apk add --no-cache python make g++
WORKDIR /app
COPY ./site/package*.json ./
RUN npm install
COPY ./site .

# build stage
FROM dev-stage AS build-stage
RUN npm run build

FROM httpd:2-alpine AS prod-stage
COPY . /usr/home/server-files
RUN cat /usr/home/server-files/config-mod.txt >> /usr/local/apache2/conf/httpd.conf
COPY --from=build-stage /app/dist /usr/local/apache2/htdocs/
