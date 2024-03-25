import { UserResponse } from 'src/resources/user/entities/user-res.entity';
import { User } from 'src/resources/user/entities/user.entity';

export const processUserRes = (userData: User): UserResponse => {
  const { ...data } = userData;
  if (!data.password) return userData;
  delete data.password;
  return {
    ...data,
    createdAt: Number(data.createdAt),
    updatedAt: Number(data.updatedAt),
  };
};
