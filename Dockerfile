# Build stage
FROM node:10.13.0-alpine as build-stage
RUN apk --no-cache add git
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /var/www/ticketing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]