ARG NODE_VERSION=24.0.2
ARG MAGICK_VERSION=7.1.2-2

FROM node:${NODE_VERSION} AS dist
WORKDIR /tmp/
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig.json tsconfig.build.json ./
COPY src/ src/
RUN npm run build

FROM node:${NODE_VERSION}
ARG MAGICK_VERSION
LABEL org.opencontainers.image.source=https://github.com/thezanke/spongemock
WORKDIR /app/
RUN apt-get update -y && apt-get install -y --no-install-recommends \
  build-essential pkg-config curl ca-certificates \
  # IM runtime deps
  libpng-dev libjpeg-dev libtiff-dev ghostscript \
  fontconfig libfontconfig1 libfreetype6 \
  fonts-urw-base35 fonts-dejavu-core fonts-liberation \
  # Pango/Cairo (optional but great for text layout)
  libpango1.0-0 libpangocairo-1.0-0 libcairo2 \
  # IM build-time headers
  libfontconfig1-dev libfreetype6-dev \
  libpng-dev libjpeg-dev libtiff-dev \
  libpango1.0-dev libcairo2-dev \
  && fc-cache -f \
  && apt-get remove -y imagemagick
COPY "./vendor/ImageMagick-${MAGICK_VERSION}.tar.gz" /source/
RUN cd /source \
  && tar xfz "ImageMagick-${MAGICK_VERSION}.tar.gz" \
  && cd "ImageMagick-${MAGICK_VERSION}" \
  && ./configure \
  --disable-static \
  --enable-shared \
  --without-tiff \
  --without-heic \
  --without-webp \
  --without-raw \
  --without-perl \
  --with-jpeg \
  --with-png \
  --with-fontconfig \
  --with-freetype \
  --with-pango \
  && make -j"$(nproc)" \
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
