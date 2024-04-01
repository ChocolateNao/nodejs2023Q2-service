import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserResponse } from '../user/entities/user-res.entity';
import { PayloadToken, Tokens } from './interfaces/token.interface';
import { User } from '@prisma/client';
import { processUserRes } from 'src/utils/processUserRes';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async getUser(data: CreateUserDto) {
    const { login } = data;
    return await this.prisma.user.findFirst({
      where: { login },
    });
  }

  private async hashData(data: string) {
    const saltRounds = +process.env.CRYPT_SALT ?? 1;
    return await bcrypt.hash(data, saltRounds);
  }

  private async getTokens(userId: string, login: string) {
    const payload: PayloadToken = { sub: userId, login: login };
    const jwtAccessTokenOptions = {
      secret: process.env.JWT_SECRET_KEY ?? '',
      expiresIn: process.env.TOKEN_EXPIRE_TIME ?? '',
    };
    const jwtRefreshTokenOptions = {
      secret: process.env.JWT_SECRET_REFRESH_KEY ?? '',
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '',
    };

    return {
      accessToken: await this.jwtService.signAsync(
        payload,
        jwtAccessTokenOptions,
      ),
      refreshToken: await this.jwtService.signAsync(
        payload,
        jwtRefreshTokenOptions,
      ),
    };
  }

  private async updateUserRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async signUp(createAuthDto: CreateUserDto): Promise<UserResponse> {
    const hashedPassword = await this.hashData(createAuthDto.password);
    const user: User = await this.prisma.user.create({
      data: {
        ...createAuthDto,
        password: hashedPassword,
        refreshToken: '',
      },
    });
    console.log(user);
    return processUserRes(user);
  }

  async logIn(createAuthDto: CreateUserDto): Promise<Tokens> {
    const existingUser = await this.getUser(createAuthDto);
    console.log(existingUser);
    const isPasswordMatch = await bcrypt.compare(
      createAuthDto.password,
      existingUser.password,
    );
    console.log(isPasswordMatch);
    if (!existingUser || !isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens: Tokens = await this.getTokens(
      existingUser.id,
      existingUser.login,
    );

    await this.updateUserRefreshToken(existingUser.id, tokens.refreshToken);
    return tokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto;
      const { sub } = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY ?? '',
      });
      if (!sub)
        throw new UnauthorizedException('No valid refresh token provided');

      const user = await this.prisma.user.findUnique({
        where: { id: sub },
      });
      if (!user) throw new ForbiddenException('Forbidden: no user was found');

      const isRefreshTokensMatch = await bcrypt.compare(
        user.refreshToken,
        refreshToken,
      );
      if (!isRefreshTokensMatch)
        throw new ForbiddenException('Access token mismatch');

      const tokens: Tokens = await this.getTokens(user.id, user.login);

      await this.updateUserRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (err) {
      throw new ForbiddenException('Access denied');
    }
  }
}
