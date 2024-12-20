import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { UserModule } from './modules/users/user.module';
import config from './config/config';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    PrometheusModule.register(),
    ConfigModule.forRoot({
      cache: true,
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string()
          .valid('development', 'staging', 'test', 'production')
          .default('development'),
        MONGO_URI: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_MS: Joi.string()
          .pattern(/^\d+$/)
          .default(3600000),
      }),
      validationOptions: {
        convert: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
