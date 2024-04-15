# Build stage
FROM node:latest as build-stage

WORKDIR /home/node/app

RUN mkdir -p dist && chown -R node:node ./dist
RUN chmod -R 755 ./dist

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:web

# Deploy stage
FROM nginx:alpine as deploy-stage

COPY --from=build-stage /home/node/app/dist /usr/share/nginx/html/

# Custom nginx configuratin file (for SPA)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

