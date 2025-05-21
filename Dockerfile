FROM node:12.13 as dist
WORKDIR /tmp/
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig.json tsconfig.build.json ./
COPY src/ src/
RUN npm run build

FROM node:12.13
LABEL org.opencontainers.image.source=https://github.com/thezanke/spongemock
WORKDIR /app/
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends \
  libpng-dev libjpeg-dev libtiff-dev gsfonts ghostscript \
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
COPY --chown=root:root images/ images/
COPY --chown=root:root templates/ templates/
COPY --from=dist /tmp/node_modules ./node_modules
COPY --from=dist /tmp/dist ./dist
RUN npm prune --production
CMD ["node", "dist/main.js"]