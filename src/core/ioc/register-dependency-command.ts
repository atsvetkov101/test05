import { ICommand } from '../interfaces/icommand';
import { IoC, Fn , scopeIocDependencies} from './ioc';

export class RegisterDependencyCommand implements ICommand{
  dependency: string;
  dependencyResolverStrateqy: Fn;

  constructor(dependency: string, dependencyResolverStrateqy: Fn){
    this.dependency = dependency;
    this.dependencyResolverStrateqy = dependencyResolverStrateqy;
  }
  setTarget(object: any) {
    throw new Error('Method not implemented.');
  }
  execute(): void {
    // eslint-disable-next-line max-len
    const dependencies:scopeIocDependencies = IoC.getCurrentScopeDependencies();
    dependencies.set(this.dependency, this.dependencyResolverStrateqy);
  }
  getType(): string {
    return 'RegisterDependencyCommand';
  }
  
}
