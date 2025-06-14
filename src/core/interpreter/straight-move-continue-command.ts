import { AnyNaptrRecord } from 'dns';
import { BaseCommand } from '../base-command';
import { ICommand } from '../interfaces/icommand';
import { IMovable } from '../interfaces/imovable';
import { CommandExpression } from './command-expression';
import { Context } from './context';
import { ContinueExecutingExpression } from './continue-executing-expression';

export class StraightMoveContinueCommand extends BaseCommand implements ICommand {
  target: IMovable;
  private commandParameters: AnyNaptrRecord;
  constructor(commandParameters: any){
    super();
    this.commandParameters = commandParameters;
  }
  execute(): Promise<void> {
    console.log('Executing StraightMoveContinueCommand');

    const context = new Context();
    
    context.setVariable('interval', this.commandParameters['interval']);
    context.setVariable('actionCommandName', 'StraightMoveCommand');
    context.setVariable('commandParameters', this.commandParameters);
    context.setVariable('uObject', this.target);

    const expression = new ContinueExecutingExpression(
      new CommandExpression(),
    );
    expression.interpret(context);
    return Promise.resolve();
  }
  getType(): string {
    return 'StraightMoveContinueCommand';
  }
  setTarget( object: IMovable) {
    this.target = object;
  }
}