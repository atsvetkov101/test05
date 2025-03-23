import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';

export class KeepProcessingCommand extends BaseCommand implements ICommand {
  private delayMilliseconds:number;
  private commands: ICommand[];
  constructor(options: any) {
    super();
    this.delayMilliseconds = options.delayMilliseconds || 1000;
    this.commands = options.commands;
  }
  execute(): Promise<void> {
    return new Promise((resolve) => setTimeout(() => {
      if (this.commands.length === 0){
        this.commands.push(new KeepProcessingCommand({ 
          commands: this.commands,
          delayMilliseconds: this.delayMilliseconds,
        }));
      }  
      resolve();
    }, this.delayMilliseconds));
  }
  getType(): string {
    return 'KeepProcessingCommand';
  }
}