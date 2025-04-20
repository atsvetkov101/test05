import { AsyncLocalStorage } from 'node:async_hooks';

export type Fn = (...args: any[]) => any
export type scopeIocDependencies = Map<string, Fn>;
export type IocDependencies = Map<string, Map<string, Fn>>;

export class IoC{
  
  private static defaultScope = 'default';
  private static dependencies: Map<string, Map<string, Fn>>;
  // Список логинов пользователей, которые авторизованы для данной игры
  // Ключ идентификатор и гры
  private static userLogins: Map<string, string[]>;
  private static storage: any;

  public static getDefaultScopeName() {
    return IoC.defaultScope;
  }

  public static setCurrenScope( scope: string ) {
    let logins = [];
    IoC.storage.enterWith({
      currentScope: scope
    });
  }

  public static setUserLogins(gameId: string, logins: string[] ) {
    if(!IoC.userLogins) {
      IoC.userLogins = new Map();
    }
    IoC.userLogins.set(gameId, logins);
  }

  public static getCurrentScope() {
    if(!IoC.storage){
      return IoC.getDefaultScopeName();
    }
    const currentScope = IoC.storage.getStore().currentScope;
    console.log(`currentScope:${currentScope}`);
    return currentScope;
  }

  public static getUserLogins(gameId: string) {
    if(!IoC.userLogins) {
      IoC.userLogins = new Map();
    }
    const logins = IoC.userLogins.get(gameId) || [];
    return logins;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public static init( dependencies: IocDependencies ) {
    IoC.storage = new AsyncLocalStorage<object>();
    IoC.dependencies = dependencies;
    IoC.setCurrenScope(IoC.defaultScope);
  }

  public static getCurrentScopeDependencies() {
    if(!IoC.dependencies) {
      return null;
    }
    const currentScopeDependencies = IoC.dependencies.get(IoC.getCurrentScope());
    if(!currentScopeDependencies) {
      IoC.dependencies.set(IoC.getCurrentScope(), new Map<string, Fn>());
    }
    return IoC.dependencies.get(IoC.getCurrentScope());
  }

  static getRootScopeDependencies() {
    if(!IoC.dependencies) {
      return null;
    }
    return IoC.dependencies.get(IoC.defaultScope);
  }

  static getDependency(dependency: string, records: Map<string, Fn>) {
    if(!records){
      return null;
    }
    const func = records.get(dependency);
    if(!func){
      return null;
    }
    return func;
  }

  public static Resolve<T>(dependency: string, ...args: any[]) {
    let records = IoC.getCurrentScopeDependencies();
    let func = IoC.getDependency(dependency, records);
    if(!func){
      records = IoC.getRootScopeDependencies();
      func = IoC.getDependency(dependency, records);
    }
    if(!func){
      return null;
    }
    return func(...args);
  }

}


