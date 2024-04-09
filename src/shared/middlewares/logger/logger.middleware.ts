import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from './logger.service';

@Injectable()
export class CustomLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLoggerService) {}
  use(req: Request, _res: Response, next: NextFunction) {
    const logObject = {
      url: req.path,
      queryParams: req.query,
      body: req.body,
    };
    this.logger.log(logObject);
    next();
  }
}
