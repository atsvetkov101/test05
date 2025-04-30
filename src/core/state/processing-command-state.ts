import { ICommand } from '../interfaces/icommand';

export class ProcessingCommandState {
  async executeCommand(command: ICommand): Promise<void> {
    throw new Error('ProcessingCommandState.executeCommand() not implemented');
  }
}
