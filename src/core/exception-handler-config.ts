
import { ExceptionHandlerFunction } from './exception-handler-function';
import { instance } from './programm';
import { BASE_COMMAND_TYPE } from './constants';

const errorHandlerPoint4 = (command: any, e: { name: any; message: any; }) => {
  console.log(`Handling error of type ${e.name} error: ${e.message}`);
};
const programm = instance;
export class ExceptionHandlerConfig {
  public static getHandlers() {
    const handlers = new Map<string, Map<string, ExceptionHandlerFunction>>();
        
    const errorHandler = new Map<string, ExceptionHandlerFunction>();
    errorHandler.set(Error.name, (command, e) => {
      console.log(`Handling error of name '${e.name}' error: ${e.message}`);
    });

    handlers.set(BASE_COMMAND_TYPE, errorHandler);

    return handlers;
  }
}