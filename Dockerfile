FROM node:8

RUN apt-get update -y \
&& apt-get install -y imagemagick ghostscript \
&& apt-get -y autoclean \
&& apt-get -y autoremove \
&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/node/app
RUN mkdir /home/node/app/images

COPY package.json .
RUN npm install --silent

COPY src ./src

CMD ["npm", "start"]
