import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'path';
import { cwd } from 'process';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const yamlFilePath = resolve(cwd(), 'doc', 'api.yaml');
  const yamlFileContent = await readFile(yamlFilePath, { encoding: 'utf-8' });
  SwaggerModule.setup('doc', app, parse(yamlFileContent));

  await app.listen(Number(process.env.PORT) ?? 4000);
}
bootstrap();
