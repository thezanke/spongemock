import * as fs from 'fs';
import * as path from 'path';
import { Controller, Get, Param, Res, Logger } from '@nestjs/common';

const BASE_IMAGE_PATH = '/app/images';

@Controller('images')
export class ImageController {
  private logger = new Logger('ImageController');

  @Get('/:imageName')
  getImage(@Param('imageName') imageName, @Res() res) {
    const imagePath = path.join(BASE_IMAGE_PATH, imageName);

    fs.stat(imagePath, (err) => {
      if (err) {
        this.logger.error(err.message);
        res.sendFile(path.join(BASE_IMAGE_PATH, '404bob.jpg'));
        return;
      }

      res.sendFile(imagePath);
    });
  }
}
