import * as randomstring from 'randomstring';
import * as caption from 'caption';
import * as path from 'path';
import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

const BASE_IMAGE_PATH = path.resolve(__dirname, '..', '..', 'images');
const TEMPLATES_PATH = path.resolve(__dirname, '..', '..', 'templates');

@Injectable()
export class ImageService extends EventEmitter {
  private logger = new Logger('ImageService');

  randomizeCase(str) {
    return str
    .toLowerCase()
      .split('')
      .map(char => (Math.random() > 0.5 ? char : char.toUpperCase()))
      .join('');
  }

  generate(text, responseUrl, userId) {
    this.logger.log(`generating meme for: "${text}"`);

    const mockText = this.randomizeCase(text);
    const words = mockText.split(' ');
    const half = Math.ceil(words.length / 2);
    const topCaption = words.slice(0, half).join(' ');
    const bottomCaption = words.slice(half).join(' ');

    const outputFile = path.join(BASE_IMAGE_PATH, `mockbob-${randomstring.generate(5)}.jpg`);

    console.log(TEMPLATES_PATH);
    
    caption.path(
      path.join(TEMPLATES_PATH, 'spongemock.jpg'),
      {
        caption: topCaption,
        bottomCaption,
        outputFile,
      },
      (err, imgPath) => {
        if (err) {
          this.logger.error(err.message);
          return;
        }

        this.emit('generated', responseUrl, userId, imgPath, mockText);
      },
    );
  }

  getImageOrFallbackPath(imageName) {
    return new Promise((resolve) => {
      let imagePath = path.join(BASE_IMAGE_PATH, imageName);

      fs.stat(imagePath, err => {
        if (err) {
          this.logger.error(err.message);
          imagePath = path.join(TEMPLATES_PATH, '404bob.jpg');
        }

        resolve(imagePath);
      });
    });
  }
}
