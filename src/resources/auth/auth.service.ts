import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserResponse } from '../user/entities/user-res.entity';
import { TokenPayload, Tokens } from './interfaces/token.interface';
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
    const user = await this.prisma.user.findFirst({
      where: { login },
    });
    if (!user) {
      throw new NotFoundException('User not found in the database');
    }
    return user;
  }

  private async hashData(data: string) {
    const saltRounds = +process.env.CRYPT_SALT ?? 1;
    return await bcrypt.hash(data, saltRounds);
  }

  private async getTokens(login: string, userId: string) {
    const payload: TokenPayload = { login: login, userId: userId };
    console.log(payload);
    const jwtAccessTokenOptions = {
      secret: process.env.JWT_SECRET_KEY ?? '',
      expiresIn: process.env.TOKEN_EXPIRE_TIME ?? '',
    };
    const jwtRefreshTokenOptions = {
      secret: process.env.JWT_SECRET_REFRESH_KEY ?? '',
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '',
    };

    return {
      accessToken: await this.jwtService.signAsync({
        payload,
        jwtAccessTokenOptions,
      }),
      refreshToken: await this.jwtService.signAsync({
        payload,
        jwtRefreshTokenOptions,
      }),
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
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
    return processUserRes(user);
  }

  async logIn(createAuthDto: CreateUserDto): Promise<Tokens> {
    const existingUser = await this.getUser(createAuthDto);
    const isPasswordMatch = await bcrypt.compare(
      createAuthDto.password,
      existingUser.password,
    );
    if (!existingUser || !isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens: Tokens = await this.getTokens(
      existingUser.id,
      existingUser.login,
    );

    await this.updateRefreshToken(existingUser.id, tokens.refreshToken);
    return tokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const verifyToken = async () => {
      try {
        return await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.JWT_SECRET_REFRESH_KEY ?? '',
        });
      } catch {
        throw new ForbiddenException('Refresh token is invalid');
      }
    };

    const { sub, exp } = await verifyToken();

    if (exp < (new Date().getTime() + 1) / 1000) {
      throw new ForbiddenException('Refresh token is expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: sub },
    });
    if (!user)
      throw new ForbiddenException(
        'No user was found associated with this token',
      );

    const isRefreshTokensMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokensMatch)
      throw new ForbiddenException('Refresh token mismatch');

    const tokens: Tokens = await this.getTokens(user.id, user.login);

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
