import { ICommand } from '../interfaces/icommand';
import { IoC } from '../ioc/ioc';
import { CheckUserAccessUobjectStrategy } from './check-user-access-uobject-strategy';

export class OrderStrategy{
//#region attributes

  private checkAccessStrategy: CheckUserAccessUobjectStrategy;
  protected gameId: string;
  protected objectId: string
  protected actionCommandName: string;
  protected executorUserId: string;
  protected commandParameters: any;

//#endregion  
  constructor(gameId: string, 
    objectId: string, 
    actionCommandName: string, 
    executorUserId: string, 
    commandParameters: any) {
    this.gameId = gameId;
    this.objectId = objectId;
    this.actionCommandName = actionCommandName;
    this.executorUserId = executorUserId;
    this.commandParameters = commandParameters;
    this.checkAccessStrategy = new CheckUserAccessUobjectStrategy(this.gameId, this.objectId, this.executorUserId);
  }

  async execute(): Promise<boolean> {
    console.log('OrderStrategy.execute()');

    const findCommand = IoC.Resolve<ICommand>('FindObjectInStorageCommand', { gameId: this.gameId, objectId: this.objectId });
    await findCommand.execute();
    const uObject = findCommand.getResult();
    if (!uObject) {
      return Promise.reject(new Error(`Объект objectId:${this.objectId} не найден.`));
    }

    if(this.allowedForUser()){
      return this.executeAction(uObject);
    }
    return Promise.reject(new Error('Пользователь не имеет прав для выполнения этой команды.'));
  }

  allowedForUser(): boolean {
    return this.checkAccessStrategy.execute();
  }
  
  async executeAction(uObject: any): Promise<boolean>{
    const commandAction = IoC.Resolve<ICommand>(this.actionCommandName, this.commandParameters);
    commandAction.setTarget(uObject);
    await commandAction.execute();
    return Promise.resolve(true);
  }
}