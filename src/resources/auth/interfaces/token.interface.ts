export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  login: string;
}

export interface UpdateToken extends TokenPayload {
  refreshToken: string;
}
