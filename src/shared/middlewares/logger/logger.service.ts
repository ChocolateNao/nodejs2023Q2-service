import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fsPromises from 'node:fs/promises';
import * as fs from 'node:fs';
import { cwd } from 'node:process';
import { LogType } from 'src/types/log.type';

const logLevel = +process.env.LOG_LEVEL ?? 6;
const maxFileSize = +process.env.LOG_MAX_FILE_SIZE ?? 1024;
const logDir = path.resolve(cwd(), 'logs');

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  async ensureDir(path: string): Promise<void> {
    if (!fs.existsSync(path)) {
      await fsPromises.mkdir(path, { recursive: true });
      return;
    }
    return;
  }

  async rotateLogFile(targetFilePath: string): Promise<void> {
    const filePath = path.join(logDir, 'stash');
    await this.ensureDir(filePath);
    const targetFileName = targetFilePath
      .split(path.sep)
      .slice(-1)[0]
      .split('.')[0];
    const stashFileName = path.join(
      filePath,
      `${new Date().toISOString()}_${targetFileName}.log`,
    );

    try {
      const content = await fsPromises.readFile(targetFilePath, 'utf-8');
      await fsPromises.writeFile(stashFileName, content, { flag: 'w' });
      await fsPromises.unlink(targetFilePath);
    } catch (err) {
      throw new Error(`Error writing logs to file: ${err}`);
    }
  }

  async writeLogToFile(
    data: Record<string, unknown> | string,
    scope: LogType,
  ): Promise<void> {
    const filePath = path.join(logDir, scope);
    await this.ensureDir(filePath);

    const targetFile = path.join(filePath, `${scope}_logs.log`);

    await fsPromises.writeFile(targetFile, ``, { flag: 'a' });

    const stats = await fsPromises.stat(targetFile).catch(() => ({ size: 0 }));

    if (stats.size / 1024 >= maxFileSize) {
      await this.rotateLogFile(targetFile);
    }

    if (typeof data !== 'string') {
      const logDateTime = new Date().toISOString();
      data.date = logDateTime;
      data = JSON.stringify(data);
    }

    await fsPromises.writeFile(targetFile, `${data}\n`, { flag: 'a' });
  }

  async debug(message: any, ...optionalParams: any[]): Promise<void> {
    if (logLevel >= 1) {
      this.writeLogToFile(message, 'debug');
      super.debug(message, ...optionalParams);
    }
  }

  async log(message: any, ...optionalParams: any[]): Promise<void> {
    if (logLevel >= 2) {
      await this.writeLogToFile(message, 'log');
      super.log(message, ...optionalParams);
    }
  }

  async warn(message: any, ...optionalParams: any[]): Promise<void> {
    if (logLevel >= 3) {
      this.writeLogToFile(message, 'warn');
      super.warn(message, ...optionalParams);
    }
  }

  async error(message: any, ...optionalParams: any[]): Promise<void> {
    if (logLevel >= 4) {
      this.writeLogToFile(message, 'error');
      super.error(message, ...optionalParams);
    }
  }

  async fatal(message: any, ...optionalParams: any[]): Promise<void> {
    if (logLevel >= 5) {
      await this.writeLogToFile(message, 'fatal');
      super.fatal(message, ...optionalParams);
    }
  }

  async verbose(message: any, optionalParams?: string): Promise<void> {
    if (logLevel >= 6) {
      this.writeLogToFile(message, 'verbose');
      super.verbose(message, ...optionalParams);
    }
  }
}
