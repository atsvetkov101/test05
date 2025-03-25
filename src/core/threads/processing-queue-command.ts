import { KeepProcessingCommand } from '../keep-processing-command';
import { ExceptionHandler } from '../exception-handler';
import { MacroCommand } from '../macro-command';
import { ICommand } from '../interfaces/icommand';
export class ProcessingQueueCommand extends MacroCommand{
  constructor(){
    super();
  }

  async execute(): Promise<void>{
    if(!this.commands){
      return Promise.resolve();
    }
    while(this.commands.length > 0){
        const command = this.commands.shift();
        try{
          console.log(`executing command ${command.getType()}`);
          await command.execute();
        } catch(e){
          console.log(`Error ${e}`);
          ExceptionHandler.handle(command, e);
        }
    }
    return Promise.resolve();
  }

  setCommands(cmds: ICommand[]){
    this.commands = cmds;
  }

  push(command: ICommand){
    this.commands.push(command);
  }

  clear(){
    this.commands = [];
  }
}