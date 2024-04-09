import {
  Module,
  NestModule,
  RequestMethod,
  type MiddlewareConsumer,
} from '@nestjs/common';
import { UserModule } from './resources/user/user.module';
import { AlbumModule } from './resources/album/album.module';
import { TrackModule } from './resources/track/track.module';
import { ArtistModule } from './resources/artist/artist.module';
import { FavsModule } from './resources/favs/favs.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './resources/auth/auth.module';
import { CustomLoggerMiddleware } from './shared/middlewares/logger/logger.middleware';
import { CustomLoggerModule } from './shared/middlewares/logger/logger.module';
import { CustomExceptionFilterModule } from './shared/filters/exception-filter.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './resources/auth/guards/access-token.guard';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,
    PrismaModule,
    AuthModule,
    CustomLoggerModule,
    CustomExceptionFilterModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
