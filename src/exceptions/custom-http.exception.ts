import { HttpStatus } from '@nestjs/common';

import { IBaseExceptionData, BaseException } from './base.exception';

export interface ICustomHttpExceptionData extends IBaseExceptionData {
  error: string;
  errorCode: string;
}

export interface ICustomHttpExceptionOptions {
  statusCode?: HttpStatus;
  originalError?: Error;
}

export class CustomHttpException extends BaseException {
  statusCode: HttpStatus;

  constructor({ error, errorCode }: ICustomHttpExceptionData, options: ICustomHttpExceptionOptions = {}) {
    const { statusCode = HttpStatus.INTERNAL_SERVER_ERROR, originalError = undefined } = options;
    super({ error, errorCode }, { originalError });
    this.statusCode = statusCode;
  }
}
