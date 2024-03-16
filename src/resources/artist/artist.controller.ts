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
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { JSON_HEADER_NAME, JSON_HEADER_VALUE } from 'src/constants/jsonHeader';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }
}
