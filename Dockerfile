FROM node:18.14.2-alpine as development

#Set this directory as the working directory for any COPY, RUN and CMD
WORKDIR /usr/src/app
# Copy files from a source to a destination.
COPY package*.json .

RUN npm install

COPY tsconfig.json .

# Date timezone settings
RUN apk add --no-cache tzdata

ENV TZ Europe/Rome

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# COPY ./src/config ./config
# COPY .env.example .
# COPY ./src/errors ./errors
# COPY ./src/utils ./utils
# # COPY ./src/logs ./log
# COPY ./src/middlewares ./middlewares
# COPY ./src/api ./api
# COPY ./src/models ./models
# COPY ./src/types ./types
COPY . .

RUN npm run build
RUN npm prune --production
# Production image without src dir
FROM node:18.14.2-alpine as production
 
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .
COPY tsconfig.json .
COPY .env.example .
# COPY .env .

RUN npm install --only=production

COPY --from=development /usr/src/app/dist .

# exposes a port which the container will listen on.
EXPOSE 80
# CMD ["node", "dist/server.js"]


## Launch the wait tool and then your applicatio
CMD node --experimental-modules src/server.js
