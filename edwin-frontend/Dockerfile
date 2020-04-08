FROM node:13.10 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .