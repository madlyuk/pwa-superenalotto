FROM node:20-alpine AS builder

WORKDIR /app

# Installa le dipendenze
COPY package*.json ./
RUN npm install

# Copia il codice e genera il sito statico
COPY . .
RUN npx nuxt generate

# Fase 2: Nginx
FROM nginx:alpine

# Copia i file generati nella cartella di Nginx, mantenendo il path /superenalotto/
RUN mkdir -p /usr/share/nginx/html/superenalotto
COPY --from=builder /app/.output/public /usr/share/nginx/html/superenalotto

# Sostituisce la config di default di nginx per fallback SPA
RUN printf 'server {\n\
    listen 80;\n\
    location /superenalotto/ {\n\
        alias /usr/share/nginx/html/superenalotto/;\n\
        try_files $uri $uri/ /superenalotto/index.html;\n\
    }\n\
    location / {\n\
        rewrite ^/$ /superenalotto/ permanent;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
