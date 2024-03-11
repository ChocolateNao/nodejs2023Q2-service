import { v4 } from 'uuid';
import { IDatabase } from './entities/database.entity';
import { Injectable } from '@nestjs/common';
import { Album } from 'src/resources/album/entities/album.entity';
import { Artist } from 'src/resources/artist/entities/artist.entity';
import { Track } from 'src/resources/track/entities/track.entity';
import { User } from 'src/resources/user/entities/user.entity';
import { CreateAlbumDto } from 'src/resources/album/dto/create-album.dto';
import { CreateArtistDto } from 'src/resources/artist/dto/create-artist.dto';
import { CreateTrackDto } from 'src/resources/track/dto/create-track.dto';
import { CreateUserDto } from 'src/resources/user/dto/create-user.dto';
import { FavResponse } from 'src/resources/favs/entities/fav-res.entity';

@Injectable()
export class Database implements IDatabase {
  private readonly users: User[] = [];
  private readonly artists: Artist[] = [];
  private readonly tracks: Track[] = [];
  private readonly albums: Album[] = [];
  private readonly favs: FavResponse = {
    artists: [],
    albums: [],
    tracks: [],
  };

  createUser(dto: CreateUserDto): User {
    const user = {
      ...dto,
      id: v4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(user);
    return user;
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  deleteUser(id: string): void {
    const indexToDelete = this.users.findIndex((user) => user.id === id);
    this.users.splice(indexToDelete, 1);
  }

  createArtist(dto: CreateArtistDto): Artist {
    const newArtist = { ...dto, id: v4() };
    this.artists.push(newArtist);
    return newArtist;
  }

  getArtists(): Artist[] {
    return this.artists;
  }

  getArtistById(id: string): Artist {
    return this.artists.find((artist) => artist.id === id);
  }

  deleteArtist(id: string): void {
    const indexToDelete = this.artists.findIndex((artist) => artist.id === id);
    this.artists.splice(indexToDelete, 1);
  }

  createTrack(dto: CreateTrackDto): Track {
    const newTrack = { ...dto, id: v4() };
    this.tracks.push(newTrack);
    return newTrack;
  }

  getTracks(): Track[] {
    return this.tracks;
  }

  getTrackById(id: string): Track {
    return this.tracks.find((track) => track.id === id);
  }

  deleteTrack(id: string): void {
    const indexToDelete = this.tracks.findIndex((track) => track.id === id);
    this.tracks.splice(indexToDelete, 1);
  }

  createAlbum(dto: CreateAlbumDto): Album {
    const newAlbum = { ...dto, id: v4() };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  getAlbums(): Album[] {
    return this.albums;
  }

  getAlbumById(id: string): Album {
    return this.albums.find((album) => album.id === id);
  }

  deleteAlbum(id: string): void {
    const indexToDelete = this.albums.findIndex((album) => album.id === id);
    this.albums.splice(indexToDelete, 1);
  }

  getFavs(): FavResponse {
    return this.favs;
  }

  addTrackToFavs(track: Track): void {
    this.favs.tracks.push(track);
  }

  removeTrackFromFavs(id: string): void {
    const indexToDelete = this.favs.tracks.findIndex(
      (track) => track.id === id,
    );
    this.favs.tracks.splice(indexToDelete, 1);
  }

  addAlbumToFavs(album: Album): void {
    this.favs.albums.push(album);
  }

  removeAlbumFromFavs(id: string): void {
    const indexToDelete = this.favs.albums.findIndex(
      (album) => album.id === id,
    );
    this.favs.albums.splice(indexToDelete, 1);
  }

  addArtistToFavs(artist: Artist): void {
    this.favs.artists.push(artist);
  }

  removeArtistFromFavs(id: string): void {
    const indexToDelete = this.favs.artists.findIndex(
      (artist) => artist.id === id,
    );
    this.favs.artists.splice(indexToDelete, 1);
  }
}
