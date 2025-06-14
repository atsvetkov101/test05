import { Context } from '../interpreter/context';

export interface IExpression {
  interpret(context: Context): Promise<void>;
}
        