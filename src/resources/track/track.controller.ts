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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { JSON_HEADER_NAME, JSON_HEADER_VALUE } from 'src/constants/jsonHeader';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(201)
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  findOne(@Param('id') id: string) {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Header(JSON_HEADER_NAME, JSON_HEADER_VALUE)
  remove(@Param('id') id: string) {
    return this.trackService.remove(id);
  }
}
