import { KeepProcessingCommand } from '../keep-processing-command';
import { ExceptionHandler } from '../exception-handler';
import { MacroCommand } from '../macro-command';
import { ICommand } from '../interfaces/icommand';
import { IoC } from '../ioc/ioc';

export class ProcessingQueueCommand extends MacroCommand{

  private static games = new Map();
  private currentGameName: string;
  private quant: number = 500; // в миллисекундах
  constructor(options: any = {}){
    super();
    const gameName = options.gameName || 'default';
    if (!ProcessingQueueCommand.games.get(gameName)) {
      const objects = options.objects || new Map();
      const commands = options.commands || [];
      ProcessingQueueCommand.games.set(gameName, {
        gameName,
        objects,
        commands,
      });
    }
   
    this.currentGameName = gameName;
    // this.objects = new Map();;
  }

  setCurrentGame( gameName:string ){
    this.currentGameName = gameName;
  }

  async execute(): Promise<void>{
    const startTime = new Date().getTime();

    const elapsedMilliseconds =(): number => {
      const currentTime = new Date();
      return currentTime.getTime() - startTime;
    }

    const commands = ProcessingQueueCommand.games.get(this.currentGameName).commands;

    if(!commands){
      return Promise.resolve();
    }
    while(commands.length > 0){
        const e1 = elapsedMilliseconds();
        const command = commands.shift();
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
    ProcessingQueueCommand.games.get(this.currentGameName).commands = cmds;
  }

  getCommands(): ICommand[]{
    return ProcessingQueueCommand.games.get(this.currentGameName).commands;
  }

  push(command: ICommand){
    ProcessingQueueCommand.games.get(this.currentGameName).commands.push(command);
  }

  clear(){
    ProcessingQueueCommand.games.get(this.currentGameName).commands = [];
  }
  
  public getObjects(){
    return ProcessingQueueCommand.games.get(this.currentGameName).objects;
  }
}