FROM node:16-alpine

LABEL maintainer="Javier Galarza <jegj57@gmail.com>"

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

COPY . /pgfilter
WORKDIR /pgfilter
ENV NODE_ENV production
RUN npm install --production

ENTRYPOINT ["node", "pgfilter.js"]
