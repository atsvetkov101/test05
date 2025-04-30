import { KeepProcessingCommand } from '../keep-processing-command';
import { ExceptionHandler } from '../exception-handler';
import { MacroCommand } from '../macro-command';
import { ICommand } from '../interfaces/icommand';
import { IoC } from '../ioc/ioc';
import appEventProcessorInstance from '../runtime/app-event-processor-instance';
import { APP_EVENTS } from '../runtime/app-event-processor';
import { ProcessingQueueCommand } from './processing-queue-command';
import { ProcessingCommandState } from '../state/processing-command-state';
import { RegularCommandState } from '../state/regular-command-state';
import { ITargetQueue } from '../state/itarget-queue';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

export class ProcessingQueueStateCommand extends ProcessingQueueCommand implements ITargetQueue{
  private targetGameName: string;
  private state: ProcessingCommandState;
  private 
  constructor(options: any = {}){
    super(options);
    this.state = options.state || new RegularCommandState();
  }
  async getTargetQueue(): Promise<ICommand[]> {
    return Promise.resolve(this.getTargetCommands());
  }

  public getState(): ProcessingCommandState{
    return this.state;
  }

  public setState(state: ProcessingCommandState | undefined){
    this.state = state;
  }

  async execute(): Promise<void>{
    return super.execute();
  }

  async executeCommand(command: ICommand): Promise<void>{
    let result = Promise.resolve();
    if(this.state){
      result = this.state.executeCommand(command);
    }
    return result;
  }
  setTargetGameName(gameName: string) {
    this.targetGameName = gameName;
  } 

  getTargetCommands(): ICommand[]{
    return ProcessingQueueStateCommand.games.get(this.targetGameName).commands;
  }

 }