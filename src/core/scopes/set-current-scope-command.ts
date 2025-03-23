import { ICommand } from '../interfaces/icommand';
import { IoC } from '../ioc/ioc';

export class SetCurrentScopeCommand implements ICommand{

  scope: string;
  constructor(scope: string) {
    this.scope = scope;
  }
  setTarget(object: any) {
    throw new Error('Method not implemented.');
  }
  execute(): Promise<void> {
    IoC.setCurrenScope(this.scope);
    return Promise.resolve();
  }
  getType(): string {
    return 'SetCurrentScopeCommand';
  }

}