import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
      origin: "*"
  });
  app.useStaticAssets(join(__dirname, '..', '..', 'client'));
  await app.listen(80);
}
bootstrap();