FROM node:16-alpine
LABEL maintainer="Shadapps <info@shadapps.it>"

#Execute a command
RUN mkdir -p /usr/src/app
#Set this directory as the working directory for any COPY, RUN and CMD
WORKDIR /usr/src/app
# Copy files from a source to a destination.
COPY package*.json ./

COPY tsconfig.json ./

RUN npm install --production && npm cache clean --force 

RUN tsc --w
# Date timezone settings
RUN apk add --no-cache tzdata

ENV TZ Europe/Rome

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./src/config ./config
# COPY .env ./.env
COPY .env.example ./.env.example

COPY ./src/errors ./errors

COPY ./src/utils ./utils
# COPY ./src/logs ./logs
COPY ./src/middlewares ./middlewares
COPY ./src/api ./api
COPY ./src/models ./models
COPY ./src/types ./types
COPY package.json .
COPY .env.example .

# COPY *.js ./

# exposes a port which the container will listen on.
EXPOSE 80

## Launch the wait tool and then your application
CMD node --experimental-modules dist/server.js
