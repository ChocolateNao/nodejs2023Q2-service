import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Header,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { JSON_HEADER_NAME, JSON_HEADER_VALUE } from 'src/constants/jsonHeader';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
