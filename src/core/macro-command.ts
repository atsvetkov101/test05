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
  execute(){
    if(!this.commands){
      return;
    }
    while(this.commands.length > 0){
      const command = this.commands.shift();
      command.execute();
    }
  }
}