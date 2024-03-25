import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate } from 'uuid';
import { Track } from './entities/track.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = await this.prisma.track.create({ data: createTrackDto });
    return newTrack;
  }

  async findAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    if (!validate(id)) throw new BadRequestException('Invalid trackId');

    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOne(id);
    const updatedTrack = await this.prisma.track.update({
      where: { id: track.id },
      data: updateTrackDto,
    });

    return updatedTrack;
  }

  async remove(id: string): Promise<void> {
    const trackToDelete = await this.findOne(id);
    await this.prisma.track.delete({ where: { id: trackToDelete.id } });
  }
}
