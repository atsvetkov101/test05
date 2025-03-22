import { ICommand } from './interfaces/icommand';
import { ExceptionHandlerFunction } from './exception-handler-function';
import { ExceptionHandlerConfig } from './exception-handler-config';
import { BASE_COMMAND_TYPE } from './constants';
import { ApplicationError } from './application-error';
export class ExceptionHandler {

  static handlers: Map<string, Map<string, ExceptionHandlerFunction>>;

  static init() {
    ExceptionHandler.handlers = ExceptionHandlerConfig.getHandlers();
  }

  static getHandlers() {
    return ExceptionHandler.handlers;
  }
  static setHandlers(handlers: Map<string, Map<string, ExceptionHandlerFunction>>) {
    ExceptionHandler.handlers = handlers;
  }

  public static handle( command: ICommand, error: Error | unknown) {
    let commandHandlers = this.getHandlers().get(command.getType());
    if (!commandHandlers) {
      commandHandlers = this.getHandlers().get(BASE_COMMAND_TYPE);
    }
    if (!commandHandlers) {
      return;
    }
    if (error instanceof Error){
      const callback = commandHandlers.get(error.name);
      if (callback) {
        callback.call(this, command, error as ApplicationError);
      }
    }
  }
}

ExceptionHandler.init();
