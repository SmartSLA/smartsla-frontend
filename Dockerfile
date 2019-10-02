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
COPY --from=build-stage /app/dist /usr/share/nginx/html
VOLUME ["/usr/share/nginx/html/env"]
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]