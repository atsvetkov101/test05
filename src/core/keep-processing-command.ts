import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';
import { IoC } from './ioc/ioc';

export class KeepProcessingCommand extends BaseCommand implements ICommand {
  private delayMilliseconds:number;
  private commands: ICommand[];
  constructor(options: any) {
    super();
    this.delayMilliseconds = options.delayMilliseconds || 1000;
    this.commands = options.commands;
  }
  execute(): Promise<void> {
    const currentScope = IoC.getCurrentScope();
    console.log(`KeepProcessingCommand: currentScope:${currentScope}`);
    return new Promise((resolve) => setTimeout(() => {
      let shouldNotAdd = false;
      if (this.commands.length > 0){
        const hardStopCommandFound = this.commands.filter((item) => item.getType() === 'HardStopCommand').length > 0;
        const softStopCommandFound = this.commands.filter((item) => item.getType() === 'SoftStopCommand').length > 0;
        const lastCommand = this.commands[this.commands.length-1];
        const lastCommandKeepProcessingCommand = lastCommand.getType() === 'KeepProcessingCommand';
        shouldNotAdd = hardStopCommandFound || softStopCommandFound || lastCommandKeepProcessingCommand;
      }
      if (this.commands.length === 0 || !shouldNotAdd){
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