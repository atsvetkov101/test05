import { IExpression } from '../interfaces/iexpression';
import { Context } from './context';

export class ContinueExecutingExpression implements IExpression {
  private internalExpression:IExpression;
  constructor(expression:IExpression){
    this.internalExpression = expression;
  }
  interpret(context: Context): Promise<void> {
    return new Promise((resolve, reject) => {
      const myTimer = setInterval(async () => {
        this.internalExpression.interpret(context);
      },
      context.getVariable('interval'));
      resolve();
    });
  }
}
