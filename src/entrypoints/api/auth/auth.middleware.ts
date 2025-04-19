import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import httpContext from 'express-http-context';

const USER_HTTP_CONTEXT = 'user';

interface IBaseExceptionOptions {
  originalError?: Error;
}

interface ICustomHttpExceptionOptions {
  statusCode?: HttpStatus;
  originalError?: Error;
}

abstract class BaseException extends Error { 
  errorCode: string;
  error: string;
  originalError: Error | undefined;
  protected constructor({ error, errorCode}, options: IBaseExceptionOptions = {}) {
    super(error);
    Error.captureStackTrace(this, this.constructor);
    this.errorCode = errorCode;
    this.error = error;

    const { originalError = undefined } = options;
    this.originalError = originalError;
  }
}

class CustomHttpException extends BaseException {
  statusCode: HttpStatus;
  constructor({ error, errorCode }, options: ICustomHttpExceptionOptions = {}) {
    const { statusCode = HttpStatus.INTERNAL_SERVER_ERROR, originalError = undefined  } = options;
    super({ error, errorCode }, { originalError });
    this.statusCode = statusCode;
  }
}


@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
	constructor(private readonly jwtService: JwtService) {}

	async use(req: Request, _: Response, next: NextFunction) {
		const token = req.headers.authorization;
		if (!token?.split(' ')[1]) {
			throw new CustomHttpException(
				{
					errorCode: 'InvalidToken',
					error: 'Invalid Token',
				},
				{ statusCode: HttpStatus.UNAUTHORIZED },
			);
		}
		let decodedToken;
		try {
			decodedToken = await this.jwtService.verifyAsync(token.split(' ')[1]);
		} catch (err: any) {
			throw new CustomHttpException(
				{
					errorCode: 'InvalidToken',
					error: 'Invalid Token',
				},
				{ statusCode: HttpStatus.UNAUTHORIZED },
			);
		}
		httpContext.set(USER_HTTP_CONTEXT, decodedToken.id);
		next();
	}
}
