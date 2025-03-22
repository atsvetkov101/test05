export class ApplicationError extends Error {

  public errorNumber: number;
  constructor(message: string) {
    super(message);
  }
}