import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'path';
import { cwd } from 'node:process';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import 'dotenv/config';
import { CustomExceptionFilter } from './shared/filters/exception-filter.service';
import { CustomLoggerService } from './shared/middlewares/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const logger = await app.resolve(CustomLoggerService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new CustomExceptionFilter(app.get(HttpAdapterHost), logger),
  );

  process.on('uncaughtException', async (error) => {
    await logger.fatal(error);
    throw error;
  });

  process.on('unhandledRejection', async (error) => {
    await logger.fatal(error);
    throw error;
  });

  const yamlFilePath = resolve(cwd(), 'doc', 'api.yaml');
  const yamlFileContent = await readFile(yamlFilePath, { encoding: 'utf-8' });
  SwaggerModule.setup('doc', app, parse(yamlFileContent));

  await app.listen(+process.env.PORT ?? 4000);
}
bootstrap();
