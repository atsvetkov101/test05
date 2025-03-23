import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';

export class SoftStopCommand extends BaseCommand implements ICommand {
  private commands: ICommand[];
  constructor(options: any) {
    super();
    this.commands = options.commands;
  }
  execute(): Promise<void> {
    if(this.commands.length === 0 ||
      (this.commands.length === 1 && this.commands[0].getType() === 'KeepProcessingCommand')){
      this.commands = [];
    }else{
      this.commands.push(new SoftStopCommand({ commands: this.commands }));
    }
    return Promise.resolve();
  }
  getType(): string {
    return 'SoftStopCommand';
  }
}