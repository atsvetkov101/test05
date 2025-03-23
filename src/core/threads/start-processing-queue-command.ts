import { BaseCommand } from '../base-command';
import { ICommand } from '../interfaces/icommand';
import { ProcessingQueueCommand } from './processing-queue-command';

export class StartProcessingQueueCommand extends BaseCommand implements ICommand{
  private commands: ICommand[];
  constructor(options: any) {
    super();
    this.commands = options.commands || [];
  }

  execute(): Promise<void> {
    const command = new ProcessingQueueCommand();
    command.setCommands(this.commands);
    return command.execute();
  }
  getType(): string {
    return 'StartProcessingQueueCommand';
  }
}