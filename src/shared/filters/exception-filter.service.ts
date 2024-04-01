import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomLoggerService } from '../middlewares/logger/logger.service';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: CustomLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const resBody = {
      isError: true,
      statusCode: status,
      path: req.url,
      description: message,
    };

    if (status >= 200 && status < 300) {
      this.logger.log(resBody);
    } else {
      this.logger.error(resBody);
    }

    httpAdapter.reply(res, resBody, status);
  }
}
