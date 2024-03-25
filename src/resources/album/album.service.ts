import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate } from 'uuid';
import { Album } from './entities/album.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = await this.prisma.album.create({ data: createAlbumDto });
    return newAlbum;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    if (!validate(id)) throw new BadRequestException('Invalid albumId');

    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);

    const updatedAlbum = await this.prisma.album.update({
      where: { id: album.id },
      data: updateAlbumDto,
    });

    return updatedAlbum;
  }

  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);
    await this.prisma.album.delete({ where: { id: album.id } });
  }
}
