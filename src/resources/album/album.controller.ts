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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JSON_HEADER_NAME, JSON_HEADER_VALUE } from 'src/constants/jsonHeader';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(201)
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  findOne(@Param('id') id: string) {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  remove(@Param('id') id: string) {
    return this.albumService.remove(id);
  }
}
