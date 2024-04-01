import { Module } from '@nestjs/common';
import { CustomExceptionFilter } from './exception-filter.service';
import { CustomLoggerModule } from '../middlewares/logger/logger.module';

@Module({
  providers: [CustomExceptionFilter],
  imports: [CustomLoggerModule],
  exports: [CustomExceptionFilter],
})
export class CustomExceptionFilterModule {}
