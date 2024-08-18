import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupUserDto } from './dto/user-signup.dto';
import { UsersLogicService } from '../users/services/users-logic.service';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { TokenPayload } from 'src/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersLogicService: UsersLogicService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersLogicService.findOneUser({ email });
    if (user && (await compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Email or passord is not correct');
  }
  async signupUser(signupData: SignupUserDto) {
    const { password } = signupData;

    return this.usersLogicService.createUser({
      ...signupData,
      password: await hash(password, 10),
    });
  }

  async login(user: User, res: Response) {
    const expiresAcessToken = new Date();
    expiresAcessToken.setMilliseconds(
      expiresAcessToken.getMilliseconds() +
        parseInt(
          this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
        ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getMilliseconds() +
        parseInt(
          this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
        ),
    );

    const { _id } = user;
    const tokenPayload: TokenPayload = { userId: _id.toHexString() };
    // const tokenPayload: ITokenPayload = {
    //   businessId,
    //   userId: _id,
    //   userRole,
    //   userName: name,
    //   userType: userType as BusinessUserTypes<keyof typeof UserTypes>,
    // };
    // const expires = new Date();
    // expires.setSeconds(
    //   expires.getSeconds() +
    //     this.configService.get<number>('JWT_EXPIRATION_TIME'),
    // );

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow<number>('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow<number>('JWT_REFRESH_TOKEN_EXPIRATION_MS')}ms`,
    });
    await this.usersLogicService.updateUser(
      { _id: _id },
      {
        $set: { refreshToken: await hash(refreshToken, 10) },
      },
    );

    res.cookie('Authentication', accessToken, {
      secure: true,
      httpOnly: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAcessToken,
    });

    res.cookie('Refresh', refreshToken, {
      secure: true,
      httpOnly: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });
    // TODO Store this token in databse  so that we can revoke/cancel this token anytime user wants to expire his session
    // TODO CONTD Implement TTL on this token/sessions collection
    return { token: accessToken };
  }

  async verifyUserRefreshToken(refreshToken: string, userId: string) {
    const user = await this.usersLogicService.getUserById(userId);
    const authenticated = await compare(refreshToken, user.refreshToken);
    if (!authenticated) throw new UnauthorizedException();
    return user;
  }
}
