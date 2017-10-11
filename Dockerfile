FROM node:8

# All credit to https://store.docker.com/community/images/starefossen/node-imagemagick for the following lines
# Added gsfont and ghostscript to installed packages
ENV MAGICK_URL "http://imagemagick.org/download/releases"
ENV MAGICK_VERSION 6.9.1-10

RUN gpg --keyserver pool.sks-keyservers.net --recv-keys 8277377A \
  && apt-get update -y \
  && apt-get install -y --no-install-recommends \
    libpng-dev libjpeg-dev libtiff-dev libopenjpeg-dev gsfonts ghostscript \
  && apt-get remove -y imagemagick \
  && cd /tmp \
  && curl -SLO "${MAGICK_URL}/ImageMagick-${MAGICK_VERSION}.tar.xz" \
  && curl -SLO "${MAGICK_URL}/ImageMagick-${MAGICK_VERSION}.tar.xz.asc" \
  && gpg --verify "ImageMagick-${MAGICK_VERSION}.tar.xz.asc" "ImageMagick-${MAGICK_VERSION}.tar.xz" \
  && tar xf "ImageMagick-${MAGICK_VERSION}.tar.xz" \
  && cd "ImageMagick-${MAGICK_VERSION}" \
  && ./configure \
  --disable-static \
  --enable-shared \
  --with-jpeg \
  --with-jp2 \
  --with-openjp2 \
  --with-png \
  --with-tiff \
  --with-quantum-depth=8 \
  --without-magick-plus-plus \
  --without-bzlib \
  --without-zlib \
  --without-dps \
  --without-fftw \
  --without-fpx \
  --without-djvu \
  --without-fontconfig \
  --without-freetype \
  --without-jbig \
  --without-lcms \
  --without-lcms2 \
  --without-lqr \
  --without-lzma \
  --without-openexr \
  --without-pango \
  --without-webp \
  --without-x \
  --without-xml \
  && make \
  && make install \
  && ldconfig /usr/local/lib \
  && apt-get -y autoclean \
  && apt-get -y autoremove \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/node/app
COPY package.json .
ENV NODE_ENV=production
RUN npm install --production --silent
COPY src ./src

CMD ["npm", "start"]
