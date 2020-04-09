FROM node:13.10 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html