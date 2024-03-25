export class UserResponse {
  id: string; // uuid v4
  login: string;
  version: number;
  createdAt: number | Date | string;
  updatedAt: number | Date | string;
}
