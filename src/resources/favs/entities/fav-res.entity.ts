import { Album } from 'src/resources/album/entities/album.entity';
import { Artist } from 'src/resources/artist/entities/artist.entity';
import { Track } from 'src/resources/track/entities/track.entity';

export class FavResponse {
  artists: Artist['id'][];
  albums: Album['id'][];
  tracks: Track['id'][];
}
