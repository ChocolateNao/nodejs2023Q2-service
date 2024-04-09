import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Database } from 'src/database/database';
import { validate } from 'uuid';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';

@Injectable()
export class FavsService {
  constructor(private database: Database) {}

  private findEntityById(entity: 'track' | 'album' | 'artist', id: string) {
    if (!validate(id)) throw new BadRequestException(`Invalid ${entity}Id`);
    let foundResource: Track | Album | Artist;
    switch (entity) {
      case 'track':
        foundResource = this.database.getTrackById(id);
        break;
      case 'album':
        foundResource = this.database.getAlbumById(id);
        break;
      case 'artist':
        foundResource = this.database.getArtistById(id);
        break;
    }
    if (!foundResource)
      throw new UnprocessableEntityException(`${entity} not found`);
    return foundResource;
  }

  findAll() {
    const artists = this.database
      .getArtists()
      .filter((artist) =>
        this.database.getFavs().artists.some((id) => id === artist.id),
      );
    const albums = this.database
      .getAlbums()
      .filter((album) =>
        this.database.getFavs().albums.some((id) => id === album.id),
      );
    const tracks = this.database
      .getTracks()
      .filter((track) =>
        this.database.getFavs().tracks.some((id) => id === track.id),
      );
    return { artists, albums, tracks };
  }

  createFav(entity: 'track' | 'album' | 'artist', id: string) {
    switch (entity) {
      case 'track':
        const track = this.findEntityById('track', id);
        this.database.addTrackToFavs(track as Track);
        break;
      case 'album':
        const album = this.findEntityById('album', id);
        this.database.addAlbumToFavs(album as Album);
        break;
      case 'artist':
        const artist = this.findEntityById('artist', id);
        this.database.addArtistToFavs(artist as Artist);
        break;
    }
  }

  removeFav(entity: 'track' | 'album' | 'artist', id: string) {
    switch (entity) {
      case 'track':
        const track = this.findEntityById('track', id);
        this.database.removeTrackFromFavs(track.id);
        break;
      case 'album':
        const album = this.findEntityById('album', id);
        this.database.removeAlbumFromFavs(album.id);
        break;
      case 'artist':
        const artist = this.findEntityById('artist', id);
        this.database.removeArtistFromFavs(artist.id);
        break;
    }
  }
}
