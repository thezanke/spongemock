FROM node:8-jessie

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends \
  libpng-dev libjpeg-dev libtiff-dev libopenjpeg-dev gsfonts ghostscript \
  && apt-get remove -y imagemagick
  
ENV MAGICK_VERSION 7.0.8-60

COPY "./vendor/ImageMagick-${MAGICK_VERSION}.tar.gz" /source/

RUN cd /source \
  && tar xfz "ImageMagick-${MAGICK_VERSION}.tar.gz" \
  && cd "ImageMagick-${MAGICK_VERSION}" \
  && ./configure \
    --disable-static \
    --enable-shared \
    --with-jpeg \
    --with-png \
  && make \
  && make install \
  && ldconfig /usr/local/lib

RUN apt-get -y autoclean \
  && apt-get -y autoremove \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* "/source/ImageMagick-${MAGICK_VERSION}"

WORKDIR /app

COPY package.json .
RUN npm install --silent

COPY src ./src

ENV PORT 80

CMD ["npm", "start"]
