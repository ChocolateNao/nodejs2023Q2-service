import { CreateAlbumDto } from 'src/resources/album/dto/create-album.dto';
import { Album } from 'src/resources/album/entities/album.entity';
import { CreateArtistDto } from 'src/resources/artist/dto/create-artist.dto';
import { Artist } from 'src/resources/artist/entities/artist.entity';
import { FavResponse } from 'src/resources/favs/entities/fav-res.entity';
import { CreateTrackDto } from 'src/resources/track/dto/create-track.dto';
import { Track } from 'src/resources/track/entities/track.entity';
import { CreateUserDto } from 'src/resources/user/dto/create-user.dto';
import { User } from 'src/resources/user/entities/user.entity';

export interface IDatabase {
  createUser: (dto: CreateUserDto) => User;
  getUsers: () => User[];
  getUserById: (id: string) => User;
  deleteUser: (id: string) => void;

  createArtist: (dto: CreateArtistDto) => Artist;
  getArtists: () => Artist[];
  getArtistById: (id: string) => Artist;
  deleteArtist: (id: string) => void;

  createTrack: (dto: CreateTrackDto) => Track;
  getTracks: () => Track[];
  getTrackById: (id: string) => Track;
  deleteTrack: (id: string) => void;

  createAlbum: (dto: CreateAlbumDto) => Album;
  getAlbums: () => Album[];
  getAlbumById: (id: string) => Album;
  deleteAlbum: (id: string) => void;

  getFavs: () => FavResponse;
  addTrackToFavs: (track: Track) => void;
  removeTrackFromFavs: (id: string) => void;

  addAlbumToFavs: (album: Album) => void;
  removeAlbumFromFavs: (id: string) => void;

  addArtistToFavs: (artist: Artist) => void;
  removeArtistFromFavs: (id: string) => void;
}
