import { ICommand } from '../interfaces/icommand';
import { IGetCommands } from './iget-commands';
import { ITargetQueue } from './itarget-queue';
import { ProcessingCommandState } from './processing-command-state';

export class MoveToCommandState extends ProcessingCommandState {
  private targetHolder: ITargetQueue;
  private sourceCommandsKeeper: IGetCommands;
  private moveToCommands: ICommand[];
  constructor(options: any = {}){
    super();
    this.targetHolder = options.targetHolder;
    this.sourceCommandsKeeper = options.sourceCommandsKeeper;
  }
  async executeCommand(command: ICommand): Promise<void> {
    try{
      if('stateCommand' in command)  {
        return command.execute().then(
          () => console.log(`MoveToCommandState: command executed ${command.getType()}`),
          (error) => console.log(`MoveToCommandState: command executed ${command.getType()} ${JSON.stringify(error)}`)
        );
      }
      if(!this.moveToCommands){
        this.moveToCommands = await this.targetHolder.getTargetQueue();
      }
      this.moveTo(this.moveToCommands, command);
      console.log(`MoveToCommandState: command moved ${command.getType()}. targetCommands.length:${this.moveToCommands.length} `);
      Promise.resolve();
    }catch(e){
      Promise.reject(e);
    }
  }

  moveTo(target: ICommand[], command: ICommand){
    const commands = this.sourceCommandsKeeper.getCommands();
    target.push(command);
  }
}