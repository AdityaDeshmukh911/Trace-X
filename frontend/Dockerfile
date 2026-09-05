FROM node:20-alpine AS builder
WORKDIR /app
# Relative path so the built app calls whatever domain it's served from,
# and nginx.conf proxies /api to the backend container. Override with
# --build-arg VITE_API_URL=https://your-domain.com/api/v1 if needed.
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
