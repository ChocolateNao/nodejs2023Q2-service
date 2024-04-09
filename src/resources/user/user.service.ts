import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { excludePassword } from 'src/utils/excludePassword';
import { Database } from 'src/database/database';
import { validate } from 'uuid';
import { User } from './entities/user.entity';
import { UserResponse } from './entities/user-res.entity';

@Injectable()
export class UserService {
  constructor(private database: Database) {}

  private getUserByIdFull(
    id: string,
    isPasswordHidden = false,
  ): User | UserResponse {
    if (!validate(id)) throw new BadRequestException('Invalid userId');

    const user = this.database.getUserById(id);
    if (!user) throw new NotFoundException('User not found');

    if (isPasswordHidden) {
      return excludePassword(user);
    }
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const user = this.database.createUser(createUserDto);
    return excludePassword(user);
  }

  findAll() {
    const users = this.database.getUsers();
    return users.map((user) => excludePassword(user));
  }

  findOne(id: string) {
    return this.getUserByIdFull(id, true);
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const userFull = this.getUserByIdFull(id) as User;
    if (userFull.password !== updatePasswordDto.oldPassword)
      throw new ForbiddenException('Passwords does not match');

    if (userFull.password !== updatePasswordDto.newPassword) {
      const updatedUser: User = {
        ...userFull,
        password: updatePasswordDto.newPassword,
        version: ++userFull.version,
        updatedAt: Date.now(),
      };
      return excludePassword(Object.assign(userFull, updatedUser));
    }
    return excludePassword(userFull);
  }

  remove(id: string) {
    const userFull = this.getUserByIdFull(id) as User;
    return this.database.deleteUser(userFull.id);
  }
}
