FROM node:13.10 as build

WORKDIR /front
COPY package*.json ./
RUN npm install
COPY . .