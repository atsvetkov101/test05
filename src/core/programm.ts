import { ICommand } from './interfaces/icommand';
import { ExceptionHandler } from './exception-handler';

let queue: ICommand[] = [
];
import { StraightMovement } from './straight-movement';
import { Rotation } from './rotation';

class Programm {

  actions: Map<string,object> = new Map<string,object>();

  public init() {
    this.actions.set('straight movement', new StraightMovement());
    this.actions.set('rotation', new Rotation());
  }

  public setQueue = (commands: ICommand[]) => {
    queue = commands;
  };
  
  public getQueue = () => {
    return queue;
  };
  
  public main = (): string => {
    while(queue.length > 0) {
      const command: ICommand = queue.shift();
      try{
        command.execute();
      } catch(e) {
        ExceptionHandler.handle(command, e);
      }
    }
    return 'Выполнение завершено'; 
  };
  public static instance() {
    return programm;
  }
}

const programm: Programm = new Programm();

export default Programm;

export { programm as instance };




