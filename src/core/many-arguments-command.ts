import { ICommand } from './interfaces/icommand';

export class ManyArgumentsCommand implements ICommand{
  constructor_args;
  constructor(...args: any[]){
    this.constructor_args = args[0];
  }
  setTarget(object: any) {
    throw new Error('Method not implemented.');
  }
  execute(): void {
    // do nothing;
  }
  getType(): string {
    return 'ManyArgumentsCommand';
  }

  getArgs(){
    return this.constructor_args;
  }
}
