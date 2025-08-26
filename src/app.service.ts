import { Injectable, Logger } from '@nestjs/common';
import { map } from 'rxjs/operators';
import * as path from 'path';
import { ImageService } from './image/image.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private logger = new Logger('AppService');

  constructor(private readonly imageService: ImageService, private readonly httpService: HttpService) {
    this.imageService.on('generated', this.handleGenerateImage.bind(this));
  }

  createBody(mockText, userId, imageUrl) {
    return {
      attachments: [
        {
          fallback: mockText,
          pretext: `<@${userId}> says:`,
          image_url: imageUrl,
        },
      ],
      replace_original: 'true',
      response_type: 'in_channel',
    };
  }

  async handleGenerateImage(responseUrl, userId, imgPath, mockText) {
    try {
      const baseName = path.basename(imgPath);
      const imageUrl = `http://spongemock.scummy.dev/images/${baseName}`;

      if (!responseUrl) {
        this.logger.log('generated', imageUrl);
        return;
      }

      const body = this.createBody(mockText, userId, imageUrl);

      this.logger.log(`Responding to slack at ${responseUrl} with body:`);
      this.logger.log(JSON.stringify(body, null, 2));

      const result = await firstValueFrom(
        this.httpService.post(responseUrl, body).pipe(map(res => res.data)),
      );

      this.logger.log(result);
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
