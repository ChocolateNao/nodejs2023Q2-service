import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Database } from 'src/database/database';
import { validate } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private database: Database) {}

  create(createTrackDto: CreateTrackDto) {
    const newTrack = this.database.createTrack(createTrackDto);
    return newTrack;
  }

  findAll() {
    return this.database.getTracks();
  }

  findOne(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid trackId');

    const track = this.database.getTrackById(id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);
    const updatedTrack = {
      ...track,
      name: updateTrackDto.name,
      duration: updateTrackDto.duration,
      artistId: updateTrackDto.artistId,
      albumId: updateTrackDto.albumId,
    };
    this.database.getTracks().map((track) => {
      return track.id === id ? updatedTrack : track;
    });

    return updatedTrack;
  }

  remove(id: string) {
    const track = this.findOne(id);
    return this.database.deleteTrack(track.id);
  }
}
