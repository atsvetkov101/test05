import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';
import { ProcessingQueueStateCommand } from './threads/processing-queue-state-command';

export class HardStopStateCommand extends BaseCommand implements ICommand {
  private processingCommand: ProcessingQueueStateCommand;
  constructor(options: any) {
    super();
    this.processingCommand = options.processingCommand;
  }
  execute(): Promise<void> {
    this.processingCommand.setState(undefined);
    return Promise.resolve();
  }
  getType(): string {
    return 'HardStopCommand';
  }
}