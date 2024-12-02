import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'express';
import responseTime from 'response-time';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupGracefulShutdown({ app });

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.use(
    compression({
      level: 6,
    }),
  );
  app.use(responseTime());

  // Enable Validations
  // ╦ ╦╔═╗╔═╗  ╔═╗╦  ╔═╗╔╗ ╔═╗╦    ╔═╗╦╔═╗╔═╗╔═╗
  // ║ ║╚═╗║╣   ║ ╦║  ║ ║╠╩╗╠═╣║    ╠═╝║╠═╝║╣ ╚═╗
  // ╚═╝╚═╝╚═╝  ╚═╝╩═╝╚═╝╚═╝╩ ╩╩═╝  ╩  ╩╩  ╚═╝╚═╝
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('api');

  app.enableCors();
  app.use(helmet());

  // ╔═╗╦ ╦╔═╗╔═╗╔═╗╔═╗╦═╗
  // ╚═╗║║║╠═╣║ ╦║ ╦║╣ ╠╦╝
  // ╚═╝╚╩╝╩ ╩╚═╝╚═╝╚═╝╩╚═
  // READ MORE ABOUT SWAGGER FROM THIS DOCS
  //! https://medium.com/@metesayan/how-to-document-your-nestjs-apis-with-swagger-42bdefd13698
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestJS Starter Boilerplate')
    .setDescription('Description of the project')
    .setVersion('1.0')
    .addTag('nestjs-start-boilerplate')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const logger = new Logger();
  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(configService.get('APP_PORT'));
  logger.log(`APP IS LISTENING TO PORT ${configService.get('APP_PORT')} `);
}
bootstrap();
