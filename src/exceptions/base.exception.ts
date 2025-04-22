export interface IBaseExceptionData {
  error: string;
  errorCode: string;
}

export interface IBaseExceptionOptions {
  originalError?: Error;
}

export interface SerializedException {
  errorMessage: string;
  errorCode: string;
  stack?: string;
  originalError?: string;
  requestId?: string | null;
}

export abstract class BaseException extends Error {
  errorCode: string;

  error: string;

  originalError: Error | undefined;

  public readonly requestId: string | null;

  protected constructor({ error, errorCode }: IBaseExceptionData, options: IBaseExceptionOptions = {}) {
    super(error);
    Error.captureStackTrace(this, this.constructor);
    this.errorCode = errorCode;
    this.error = error;

    const { originalError = undefined } = options;
    this.originalError = originalError;

    this.requestId = this.getRequestId();
  }

  private getRequestId(): string | null {
    // TODO: имплементировать
    return null;
  }

  public toJSON(): SerializedException {
    return {
      errorMessage: this.error,
      errorCode: this.errorCode,
      stack: this.stack,
      ...(this.originalError ? { originalError: JSON.stringify(this.originalError) } : {}),
      requestId: this.requestId,
    };
  }
}
