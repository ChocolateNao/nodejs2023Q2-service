import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Database } from 'src/database/database';
import { validate } from 'uuid';

@Injectable()
export class ArtistService {
  constructor(private database: Database) {}

  create(createArtistDto: CreateArtistDto) {
    const newArtist = this.database.createArtist(createArtistDto);
    return newArtist;
  }

  findAll() {
    return this.database.getArtists();
  }

  findOne(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid albumId');

    const album = this.database.getArtistById(id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.findOne(id);

    const updatedArtist = {
      ...artist,
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy,
    };

    this.database.getArtists().map((artist) => {
      return artist.id === id ? updatedArtist : artist;
    });
    return updatedArtist;
  }

  remove(id: string) {
    const artist = this.findOne(id);

    this.database.getTracks().map((track) => {
      if (track.artistId === artist.id) track.artistId = null;
      return track;
    });

    this.database.getAlbums().map((album) => {
      if (album.artistId === artist.id) album.artistId = null;
      return album;
    });

    return this.database.deleteArtist(artist.id);
  }
}
