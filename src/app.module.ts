import { Module } from '@nestjs/common';
import { UserModule } from './resources/user/user.module';
import { AlbumModule } from './resources/album/album.module';
import { TrackModule } from './resources/track/track.module';
import { ArtistModule } from './resources/artist/artist.module';
import { FavsModule } from './resources/favs/favs.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,
    DatabaseModule,
  ],
})
export class AppModule {}
