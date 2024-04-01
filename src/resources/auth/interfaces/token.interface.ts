import { JwtPayload } from 'jsonwebtoken';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  login: string;
}

export interface UpdateToken extends TokenPayload {
  refreshToken: string;
}
