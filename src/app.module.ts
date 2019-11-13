import { Module, HttpModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageModule } from './image/image.module';
import { ImageService } from './image/image.service';

@Module({
  imports: [HttpModule, ImageModule],
  controllers: [AppController],
  providers: [AppService, ImageService],
})
export class AppModule {}
