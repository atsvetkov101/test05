import { ICommand } from '../interfaces/icommand';
import { IExpression } from '../interfaces/iexpression';
import { IoC } from '../ioc/ioc';
import { Context } from './context';

export class CommandExpression implements IExpression {

  constructor(){
  }
  async interpret(context: Context): Promise<void> {
    const actionCommandName = context.getVariable('actionCommandName');
    const commandParameters = context.getVariable('commandParameters');
    const uObject = context.getVariable('uObject');
    if(!actionCommandName || !uObject) {
      return Promise.resolve();
    }
    const commandAction = IoC.Resolve<ICommand>(actionCommandName, commandParameters);
    if(!commandAction) {
      return Promise.resolve();
    }
    commandAction.setTarget(uObject);
    await commandAction.execute();
    return Promise.resolve();
  }
}