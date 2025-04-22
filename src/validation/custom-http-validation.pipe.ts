import {
  HttpStatus, Injectable,
  ValidationError,
  ValidationPipe, ValidationPipeOptions,
} from '@nestjs/common';
import { CustomHttpException } from '../exceptions/custom-http.exception';
import { ERRORS } from '../exceptions/exception.constants';



const removeBuffer = (obj: any): any => {
  if (Buffer.isBuffer(obj)) {
    return '[Buffer]';
  }

  if (Array.isArray(obj)) {
    return obj.map(removeBuffer);
  }

  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = removeBuffer(obj[key]);
      return acc;
    }, {} as Record<string, any>);
  }

  return obj;
};

const ValidationError = (errors: object[]) => ({
  error: `Ошибка валидации. Подробнее: ${JSON.stringify(errors)}`,
  errorCode: 'ValidationError',
});

@Injectable()
export class CustomHttpValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      transform: true, // включает преобразование с помощью class-transformer
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      forbidUnknownValues: false,
      disableErrorMessages: false,
      enableDebugMessages: true,
      validationError: { target: true, value: true },
      exceptionFactory: (errors: ValidationError[]) => {
        const errorsWithoutBuffers = removeBuffer(errors);
        const transformedErrors = this.transformValidationErrors(errorsWithoutBuffers);

        return new CustomHttpException(
          ERRORS.ValidationError(transformedErrors),
          { statusCode: HttpStatus.BAD_REQUEST },
        );
      },
      ...options,
    });
  }

  private transformValidationErrors(errors: ValidationError[]) {
    return errors.map((error) => {
      const { property, constraints, children } = error;

      const transformed: any = {
        property,
        constraints,
      };

      if (children && children.length > 0) {
        transformed.children = this.transformValidationErrors(children);
      }

      return transformed;
    });
  }
}
