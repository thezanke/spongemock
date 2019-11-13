import * as randomstring from 'randomstring';
import * as caption from 'caption';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

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

    const outputFile = `/app/images/mockbob-${randomstring.generate(5)}.jpg`;

    caption.path(
      `/app/images/template.jpg`,
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
}
