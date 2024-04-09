import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { FavEntity } from 'src/types/favEntity.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  private async findEntityById(entity: FavEntity, id: string) {
    if (!validate(id)) throw new BadRequestException(`Invalid ${entity}Id`);
    const foundResource: Track | Album | Artist = await this.prisma[
      entity as string
    ].findUnique({
      where: { id },
    });
    if (!foundResource)
      throw new UnprocessableEntityException(`${entity} not found`);
    return foundResource;
  }

  async findAll() {
    const [favs] = await this.prisma.favs.findMany({
      select: {
        artists: {
          select: { id: true, name: true, grammy: true },
        },
        albums: {
          select: { id: true, name: true, year: true, artistId: true },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            artistId: true,
            albumId: true,
            duration: true,
          },
        },
      },
    });

    return favs ? favs : { artists: [], albums: [], tracks: [] };
  }

  async createFav(entity: FavEntity, id: string) {
    await this.findEntityById(entity, id);
    const favsIds = await this.prisma.favs.findMany();
    let favId: string;
    if (!favsIds.length) {
      const newFav = await this.prisma.favs.create({ data: {} });
      favId = newFav.id;
    } else {
      favId = favsIds[0].id;
    }

    await this.prisma[entity as string].update({
      where: { id },
      data: { favoritesId: favId },
    });
  }

  async removeFav(entity: FavEntity, id: string): Promise<void> {
    await this.findEntityById(entity, id);
    const favsIds = await this.prisma.favs.findMany();
    if (!favsIds.length) {
      throw new NotFoundException('Favs not found');
    }

    await this.prisma[entity as string].update({
      where: { id },
      data: { favoritesId: { set: null } },
    });
  }
}
