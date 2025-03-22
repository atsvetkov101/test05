import { ICommand } from './interfaces/icommand';
import { ApplicationError } from './application-error';

type ExceptionHandlerFunction = (command: ICommand, e: ApplicationError) => void;
export { ExceptionHandlerFunction };
