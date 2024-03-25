import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Header,
  HttpCode,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { JSON_HEADER_NAME, JSON_HEADER_VALUE } from 'src/constants/jsonHeader';
import { isValidFavEntity, validFavEntities } from 'src/utils/isValidFavEntity';
import { FavEntity } from 'src/types/favEntity.type';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post(':entity/:id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  @HttpCode(HttpStatus.CREATED)
  create(@Param('entity') entity: FavEntity, @Param('id') id: string) {
    if (!isValidFavEntity(entity)) {
      throw new NotFoundException(
        `Unknown entity. Only ${validFavEntities.join(', ')} are allowed`,
      );
    }
    return this.favsService.createFav(entity, id);
  }

  @Get()
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  findAll() {
    return this.favsService.findAll();
  }

  @Delete(':entity/:id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('entity') entity: FavEntity, @Param('id') id: string) {
    if (!isValidFavEntity(entity)) {
      throw new NotFoundException(
        `Unknown entity. Only ${validFavEntities.join(', ')} are allowed`,
      );
    }
    return this.favsService.removeFav(entity, id);
  }
}
