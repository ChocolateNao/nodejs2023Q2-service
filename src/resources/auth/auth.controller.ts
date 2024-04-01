import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Header,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { PublicRoute } from 'src/decorators/public-route.decorator';
import { JSON_HEADER_NAME, JSON_HEADER_VALUE } from 'src/constants/jsonHeader';
import { AccessTokenGuard } from './guards/access-token.guard';

@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  logIn(@Body() loginUserDto: CreateUserDto) {
    return this.authService.logIn(loginUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  refreshToken(
    @Body(
      new ValidationPipe({
        exceptionFactory: () => {
          return new UnauthorizedException('No valid refresh token provided');
        },
      }),
    )
    refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
