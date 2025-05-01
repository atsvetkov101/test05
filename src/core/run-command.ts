import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';
import { RegularCommandState } from './state/regular-command-state';
import { ProcessingQueueStateCommand } from './threads/processing-queue-state-command';

export class RunCommand extends BaseCommand implements ICommand {
  public get stateCommand() {
    return true;
  };
  private gameProcessing: ProcessingQueueStateCommand;
  constructor(options: any) {
    super();
    this.gameProcessing = options.gameProcessing;
  }
  async execute(): Promise<void> {
    this.gameProcessing.setState(new RegularCommandState());
    return Promise.resolve();
  }
  getType(): string {
    return 'RunCommand';
  }
}