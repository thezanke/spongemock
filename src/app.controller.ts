import { Controller, Post, Body } from '@nestjs/common';
import { ImageService } from './image/image.service';

@Controller()
export class AppController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  generateImage(@Body() body): string {
    const { text, response_url: responseUrl, user_id: userId } = body;
    this.imageService.generate(text, responseUrl, userId);
    return 'one moment please, polishing meme...';
  }
}
