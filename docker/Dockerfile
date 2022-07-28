FROM node:16 as base

ARG USER=node
USER ${USER}

##### IMAGE : API #####
FROM base as api

ARG USER=node
ARG WORKDIR=/home/${USER}/saapie

# Setting up working directory
RUN mkdir -p ${WORKDIR}/api
WORKDIR ${WORKDIR}/api

# Copying dependencies packages
COPY --chown=${USER}:users ./api/package.json ./
COPY --chown=${USER}:users ./api/yarn.lock ./

# Yarn install
RUN yarn install

# Copying files
COPY --chown=${USER}:users ./api ./

# Copying entrypoint
USER root
COPY --chown=${USER}:users ./docker/api-entrypoint.sh /
RUN sed -i 's/\r//g' /api-entrypoint.sh
ENTRYPOINT ["sh", "/api-entrypoint.sh"]
USER ${USER}

##### IMAGE : VUE BASE #####
FROM base as vue-base

ARG USER=node
ARG WORKDIR=/home/${USER}/saapie

# Setting up working directory
RUN mkdir -p ${WORKDIR}/vue
WORKDIR ${WORKDIR}/vue

# Copying dependencies packages
COPY --chown=${USER}:users ./vue/package.json ./
COPY --chown=${USER}:users ./vue/yarn.lock ./

# Yarn install
RUN yarn install

# Copying files
COPY --chown=${USER}:users ./vue ./

##### IMAGE : VUE #####
FROM vue-base as vue

ARG USER=node

# Copying entrypoint
USER root
COPY --chown=${USER}:users ./docker/vue-entrypoint.sh /
RUN sed -i 's/\r//g' /vue-entrypoint.sh
ENTRYPOINT ["sh", "/vue-entrypoint.sh"]
USER ${USER}

##### IMAGE : VUE BUILD #####
FROM vue-base as vue-build

# Build args
ARG API_URL
ENV API_URL=${API_URL}

# Yarn build
RUN yarn build

##### IMAGE : NGINX #####
FROM nginx:latest as nginx

RUN mkdir -p /usr/share/nginx/html/dist

COPY --from=vue-build /home/node/saapie/vue/dist /usr/share/nginx/html/dist
