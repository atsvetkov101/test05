import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';

export class HardStopCommand extends BaseCommand implements ICommand {
  private commands: ICommand[];
  constructor(options: any) {
    super();
    this.commands = options.commands;
  }
  execute(): Promise<void> {
    this.commands = [];
    return Promise.resolve();
  }
  getType(): string {
    return 'HardStopCommand';
  }
}