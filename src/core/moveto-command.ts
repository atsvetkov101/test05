import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';
import { ITargetQueue } from './state/itarget-queue';
import { MoveToCommandState } from './state/moveto-command-state';
import { ProcessingCommandState } from './state/processing-command-state';
import { ProcessingQueueStateCommand } from './threads/processing-queue-state-command';

export class MoveToCommand extends BaseCommand implements ICommand {
  
  private gameProcessing: ProcessingQueueStateCommand;
  constructor(options: any) {
    super();
    this.gameProcessing = options.gameProcessing;
  }
  async execute(): Promise<void> {
    this.gameProcessing.setState(new MoveToCommandState({ 
      sourceCommandsKeeper:this.gameProcessing, 
      targetHolder: this.gameProcessing }));
    return Promise.resolve();
  }
  getType(): string {
    return 'MoveToCommand';
  }
}