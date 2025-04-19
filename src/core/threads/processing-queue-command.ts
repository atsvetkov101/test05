import { KeepProcessingCommand } from '../keep-processing-command';
import { ExceptionHandler } from '../exception-handler';
import { MacroCommand } from '../macro-command';
import { ICommand } from '../interfaces/icommand';
import { IoC } from '../ioc/ioc';
import appEventProcessorInstance from '../runtime/app-event-processor-instance';
import { APP_EVENTS } from '../runtime/app-event-processor';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

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
    appEventProcessorInstance.on(APP_EVENTS.START_GAME, async (data) => {
      /*
      console.log(`appEvents: caught event:${APP_EVENTS.START_GAME}`
      + ` data:${JSON.stringify(data)}`);
      */
      // IoC.setCurrenScope(data.currentGameName);
      const commands = data.processingQueueCommand.getCommands();
      const startTime = new Date().getTime();
      
      const elapsedMilliseconds =(): number => {
        const currentTime = new Date();
        return currentTime.getTime() - startTime;
      }
      while(true){
        if (commands.length == 0){
          await sleep(1000);
          continue;
        }
        const elapsed = elapsedMilliseconds();
        const command = commands.shift();
        try{
          console.log(`executing command ${command.getType()}  commands.length:${commands.length} `);
          await command.execute();
        } catch(e){
          console.log(`Error ${e}`);
          ExceptionHandler.handle(command, e);
        }
      }
    });
  }

  async execute(): Promise<void>{
    const commands = ProcessingQueueCommand.games.get(this.currentGameName).commands;

    if(!commands){
      return Promise.resolve();
    }

    appEventProcessorInstance.emit(APP_EVENTS.START_GAME, {
      currentGameName: this.currentGameName,
      processingQueueCommand: this,
    });
    return Promise.resolve();
  }

  async startProcessing(commands){
    const startTime = new Date().getTime();

    const elapsedMilliseconds =(): number => {
      const currentTime = new Date();
      return currentTime.getTime() - startTime;
    }
    while(commands.length > 0){
      const elapsed = elapsedMilliseconds();
      const command = commands.shift();
      try{
        console.log(`executing command ${command.getType()}  commands.length:${commands.length} `);
        await command.execute();
      } catch(e){
        console.log(`Error ${e}`);
        ExceptionHandler.handle(command, e);
      }
    }
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