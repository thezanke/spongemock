import * as fs from 'fs';
import * as path from 'path';
import { Controller, Get, Param, Res, Logger } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/:imageName')
  async getImage(@Param('imageName') imageName, @Res() res) {
    const imagePath = await this.imageService.getImageOrFallbackPath(imageName);
    res.sendFile(imagePath);
  }
}
