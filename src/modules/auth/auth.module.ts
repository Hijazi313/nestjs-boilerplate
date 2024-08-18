import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    JwtModule,
    PassportModule,

    // JwtModule.registerAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
    //     secretOrPrivateKey: configService.getOrThrow<string>(
    //       'JWT_ACCESS_TOKEN_SECRET',
    //     ),
    //     signOptions: {
    //       expiresIn: `${configService.getOrThrow<number>('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
