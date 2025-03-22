import { ICommand } from '../interfaces/icommand';
import { IoC, IocDependencies, Fn} from '../ioc/ioc';
import { RegisterDependencyCommand } from '../ioc/register-dependency-command';
import { StraightMoveCommand } from '../straight-move-command';
import { TeleportationCommand } from '../teleportation-command';
import { SetCurrentScopeCommand } from './set-current-scope-command';

export class InitCommand implements ICommand {
  setTarget(object: any) {
    throw new Error('Method not implemented.');
  }
  execute(): void {
    
    const records = new Map<string, Fn>();
   
    const dependencies: IocDependencies = new Map<string, Map<string, Fn>>();
    dependencies.set(IoC.getDefaultScopeName(), records);

    records.set('StraightMoveCommand', () => {
      return new StraightMoveCommand();
    });

    records.set('TeleportationCommand', (...args) => {
      return new TeleportationCommand(args[0]);
    });

    records.set('IoC.Scope.Current.Set', (...args) => {
      return new SetCurrentScopeCommand(args[0]);
    });

    records.set('IoC.Scope.Current', () => {
      return IoC.getCurrentScope();
    });

    records.set('IoC.Register', (...args) => {
      return new RegisterDependencyCommand(args[0], args[1]);
    });

    IoC.init(dependencies);
  }
  getType(): string {
    return 'InitCommand';
  }

}