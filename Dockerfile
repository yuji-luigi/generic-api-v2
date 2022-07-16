FROM node:16-alpine
LABEL maintainer="Shadapps <info@shadapps.it>"

#Execute a command
RUN mkdir -p /usr/src/app
#Set this directory as the working directory for any COPY, RUN and CMD
WORKDIR /usr/src/app
# Copy files from a source to a destination.
COPY package*.json ./

RUN npm install --production && npm cache clean --force
# Date timezone settings
RUN apk add --no-cache tzdata
ENV TZ Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY config ./config
COPY .env ./.env
COPY .env.example ./.env.example

COPY errors ./errors
COPY utils ./utils
COPY middlewares ./middlewares
COPY api ./api
COPY models ./models
COPY *.js ./

# exposes a port which the container will listen on.
EXPOSE 80

## Launch the wait tool and then your application
CMD node server.js
