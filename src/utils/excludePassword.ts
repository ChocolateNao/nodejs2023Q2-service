import { UserResponse } from 'src/resources/user/entities/user-res.entity';
import { User } from 'src/resources/user/entities/user.entity';

export const excludePassword = (userData: User): UserResponse => {
  if (!userData.hasOwnProperty('password')) return;
  delete userData['password'];
  return userData as UserResponse;
};
