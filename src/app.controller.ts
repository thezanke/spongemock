import { Body, Controller, Logger, Post, Res, } from '@nestjs/common';
import * as path from 'node:path';
import { ImageService } from './image/image.service';
import { Response } from 'express';


@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly imageService: ImageService) { }

  @Post()
  async generateImage(@Body() body, @Res() res: Response): Promise<string | void> {
    const { text, response_url: responseUrl, user_id: userId } = body;
    const outputFilePromise = this.imageService.generate(text, responseUrl, userId);

    if (responseUrl && userId) {
      outputFilePromise.catch(err => {
        this.logger.error(`Error generating image for user ${userId}: ${err.message}`);
      });

      return 'one moment please, polishing meme...';
    }

    const imgPath = await outputFilePromise;
    res.redirect(`/images/${path.basename(imgPath)}`);
  }
}
