import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);

  // enable cors
  const allowOrigin = '*';
  app.enableCors({ origin: allowOrigin });
  const APP_NAME = process.env.APP_NAME;
  const APP_VERSION = '1.0';

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(APP_NAME)
    .setDescription(process.env.APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();

  await app.listen(process.env.PORT);
}
bootstrap();
