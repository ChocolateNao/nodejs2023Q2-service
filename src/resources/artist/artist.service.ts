import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate } from 'uuid';
import { Artist } from './entities/artist.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = await this.prisma.artist.create({
      data: createArtistDto,
    });
    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    if (!validate(id)) throw new BadRequestException('Invalid artistId');

    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);

    const updatedArtist = await this.prisma.artist.update({
      data: updateArtistDto,
      where: { id: artist.id },
    });

    return updatedArtist;
  }

  async remove(id: string): Promise<void> {
    const artistToDelete = await this.findOne(id);
    await this.prisma.artist.delete({ where: { id: artistToDelete.id } });
  }
}
