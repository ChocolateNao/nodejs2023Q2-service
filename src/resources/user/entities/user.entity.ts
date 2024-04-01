export class User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number;
  createdAt: number | Date | string;
  updatedAt: number | Date | string;
  refreshToken: string;
}
