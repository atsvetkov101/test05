import { ICommand } from '../interfaces/icommand';
import { ProcessingCommandState } from './processing-command-state';

export class RegularCommandState extends ProcessingCommandState {
  async executeCommand(command: ICommand): Promise<void> {
    return command.execute().then(
      () => console.log(`RegularCommandState: command executed ${command.getType()}`),
      (error) => console.log(`RegularCommandState: command executed ${command.getType()} ${JSON.stringify(error)}`)
  );
  }
}