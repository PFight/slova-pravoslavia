import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  /*
  const fs = require('fs');
  const keyFile  = fs.readFileSync(__dirname + '/../ssl/slova-pravoslavia.ru.key');
  const certFile = fs.readFileSync(__dirname + '/../ssl/slova-pravoslavia.ru.crt');
  console.info('Key length:' + keyFile.length);
  console.info('Cert length:' + certFile.length);
  */

  const app = await NestFactory.create(AppModule); /*, {
      httpsOptions: {
        key: keyFile,
        cert: certFile,
      }
  });*/
  app.enableCors({
      origin: "*"
  });
  app.useStaticAssets(join(__dirname, '..', '..', 'client'));
  await app.listen(80);
}
bootstrap();