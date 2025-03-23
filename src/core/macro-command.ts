import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';

export class MacroCommand extends BaseCommand {
  commands: ICommand[] = [];
  constructor(){
    super();
  }
  setCommands(cmds: ICommand[]){
    this.commands = cmds;
  }
  async execute(): Promise<void>{
    if(!this.commands){
      return Promise.resolve();;
    }
    while(this.commands.length > 0){
      const command = this.commands.shift();
      await command.execute();
    }
    return Promise.resolve();
  }
}