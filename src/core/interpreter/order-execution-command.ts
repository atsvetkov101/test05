import { BaseCommand } from '../base-command';
import { ICommand } from '../interfaces/icommand';
import { IoC } from '../ioc/ioc';
import { OrderStrategy } from './order-strategy';

/*
Необходимо реализовать:

1. Команду, которая получает на вход приказ и с помощью IoC выполняет необходимое действие.
*/
export class OrderExecutionCommand extends BaseCommand implements ICommand {
  private order: Record<string, any>;
  private uObjectid: string;
  private actionCommandName: string;
  private executorUserId: string;
  private gameId: string;
  private parameters: any;
  private strategy: OrderStrategy;
  constructor(order: Record<string, any>, ) {
    super();
    this.order = order;
    const { uObjectid, action, gameId, currentUserId, ...parameters } = order;
    this.uObjectid = uObjectid;
    this.actionCommandName = action;
    this.gameId = gameId;
    this.executorUserId = currentUserId;
    this.parameters = parameters;
    this.strategy = new OrderStrategy(this.gameId, this.uObjectid, this.actionCommandName, this.executorUserId, this.parameters);
  }
  async execute(): Promise<void> {
    const strategyResult = await this.strategy.execute();
    return strategyResult ? Promise.resolve() : Promise.reject();
  }

  getType(): string {
    return 'OrderExecutionCommand';
  }

  getOrder(): Record<string, any> {
    return this.order;
  }
  getUObjectid(): string {
    return this.uObjectid;
  }
  getAction(): string {
    return this.actionCommandName;
  }
  getParameters(): any {
    return this.parameters;
  }
}

