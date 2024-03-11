import { UserResponse } from 'src/resources/user/entities/user-res.entity';
import { User } from 'src/resources/user/entities/user.entity';

export const excludePassword = (userData: User): UserResponse => {
  const { ...data } = userData;
  if (!data.password) return userData;
  delete data.password;
  return data;
};
