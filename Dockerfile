FROM node:8-jessie

# Based on and all credit to https://store.docker.com/community/images/starefossen/node-imagemagick
ENV MAGICK_URL "http://imagemagick.org/download/releases"
ENV MAGICK_VERSION 7.0.7-7

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends \
    libpng-dev libjpeg-dev libtiff-dev libopenjpeg-dev gsfonts ghostscript \
  && apt-get remove -y imagemagick \
  && cd /tmp \
  && curl -SLO "${MAGICK_URL}/ImageMagick-${MAGICK_VERSION}.tar.gz" \
  && tar xfz "ImageMagick-${MAGICK_VERSION}.tar.gz" \
  && cd "ImageMagick-${MAGICK_VERSION}" \
  && ./configure \
  --disable-static \
  --enable-shared \
  --with-jpeg \
  --with-png \
  && make \
  && make install \
  && ldconfig /usr/local/lib \
  && apt-get -y autoclean \
  && apt-get -y autoremove \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/node/app

COPY package.json .
RUN npm install --silent

COPY src ./src

CMD ["npm", "start"]
