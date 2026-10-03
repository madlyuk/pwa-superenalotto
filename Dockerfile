FROM node:20-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file delle dipendenze
COPY package.json ./

# Installa le dipendenze
RUN npm install

# Copia il codice sorgente
COPY . /app/
