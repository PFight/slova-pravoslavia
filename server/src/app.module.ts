import { Module } from '@nestjs/common';
import { DataFileController } from './data-file.controller';
import { DataFileService } from './data-file.service';
import { ConfigService } from './config.service';

@Module({
  controllers: [DataFileController],
  providers: [ ConfigService,  DataFileService],
})
export class AppModule {}