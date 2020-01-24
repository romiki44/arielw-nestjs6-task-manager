import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger=new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  // NODE_ENV - if not_defined, takes development env
  const serverConfig=config.get('server');
  //console.log('serverConfig: ', serverConfig);

  const port=process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
