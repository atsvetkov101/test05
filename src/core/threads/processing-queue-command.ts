import { KeepProcessingCommand } from '../keep-processing-command';
import { ExceptionHandler } from '../exception-handler';
import { MacroCommand } from '../macro-command';
import { ICommand } from '../interfaces/icommand';
import { IoC } from '../ioc/ioc';
import appEventProcessorInstance from '../runtime/app-event-processor-instance';
import { APP_EVENTS } from '../runtime/app-event-processor';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

export class ProcessingQueueCommand extends MacroCommand{

  protected static games = new Map();
  private currentGameName: string;
  private quant: number = 500; // в миллисекундах
  private startGameHandler;
  private disposed: boolean = false;
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
    this.startGameHandler = async (data) => {
      
      const commands = this.getGameCommands(this.currentGameName);
      const startTime = new Date().getTime();
      
      const elapsedMilliseconds =(): number => {
        const currentTime = new Date();
        return currentTime.getTime() - startTime;
      }
      while(true){
        if (this.disposed) {
          break;
        }
        if (commands.length == 0){
          await sleep(1000);
          continue;
        }
        const elapsed = elapsedMilliseconds();
        const command = commands.shift();
        try{
          console.log(`game:'${this.currentGameName}' executing command ${command.getType()}  commands.length:${commands.length} `);
          await this.executeCommand(command);
        } catch(e: any){
          let commandType = '';
          try{
            commandType = command.getType();
          }catch(err){}
          console.log(`${commandType}: Error ${e.message}`);
          ExceptionHandler.handle(command, e);
        }
      }
    };
    appEventProcessorInstance.on(APP_EVENTS.START_GAME, this.startGameHandler);
  }
  async executeCommand(command: ICommand): Promise<void>{
    return command.execute();
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
  public async dispose(){
    appEventProcessorInstance.removeListener(APP_EVENTS.START_GAME, this.startGameHandler);
    this.disposed = true;
  }

  setCommands(cmds: ICommand[]){
    ProcessingQueueCommand.games.get(this.currentGameName).commands = cmds;
  }

  getCommands(): ICommand[]{
    return ProcessingQueueCommand.games.get(this.currentGameName).commands;
  }

  getGameCommands(gameName: string): ICommand[]{
    return ProcessingQueueCommand.games.get(gameName).commands;
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