import { ICommand } from '../interfaces/icommand';
import { IoC } from '../ioc/ioc';

export class ClearCurrentScopeCommand implements ICommand {
  execute(): void {
    IoC.init(null);
  }
  getType(): string {
    return 'ClearCurrentScopeCommand';
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTarget(object: any) {
    throw new Error('Method not implemented.');
  }
}
