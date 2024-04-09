import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { TokenPayload, UpdateToken } from '../interfaces/token.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_REFRESH_KEY ?? '',
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: TokenPayload): UpdateToken {
    const refreshToken: string = request
      .get('authorization')
      .replace('Bearer', '')
      .trim();
    return { ...payload, refreshToken };
  }
}
