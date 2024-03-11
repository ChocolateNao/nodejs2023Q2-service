import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate } from 'uuid';
import { Database } from 'src/database/database';

@Injectable()
export class AlbumService {
  constructor(private database: Database) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = this.database.createAlbum(createAlbumDto);
    return newAlbum;
  }

  findAll() {
    return this.database.getAlbums();
  }

  findOne(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid albumId');

    const album = this.database.getAlbumById(id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOne(id);

    const updatedAlbum = {
      ...album,
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
      artistId: updateAlbumDto.artistId,
    };
    this.findAll().map((album) => {
      return album.id === id ? updatedAlbum : album;
    });
    return updatedAlbum;
  }

  remove(id: string) {
    const album = this.findOne(id);

    this.database.getTracks().map((track) => {
      if (track.albumId === album.id) track.albumId = null;
      return track;
    });

    return this.database.deleteAlbum(album.id);
  }
}
