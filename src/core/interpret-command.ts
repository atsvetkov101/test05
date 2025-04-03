import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';
import { IoC } from './ioc/ioc';
import { ProcessingQueueCommand } from './threads/processing-queue-command';

export class InterpretCommand extends BaseCommand implements ICommand {

  private idGame;
  private idObject;
  private idCommand;
  private commandArgs;

  constructor(options: any){
    super();
    this.idGame = options.idGame;
    this.idObject = options.idObject;
    this.idCommand = options.idCommand;
    this.commandArgs = options.commandArgs;
  }
  async execute(): Promise<void> {
    // находим игру
    const game: ProcessingQueueCommand  = IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: this.idGame });
    
    // получаем ссылку на объекты игры
    const objects = game.getObjects();

    const findObjectCommand =  IoC.Resolve<ICommand>('FindObjectCommand', { objects, id: this.idObject } );
    await findObjectCommand.execute();
    const uObject = findObjectCommand.getResult();
    if(!uObject) {
      return;
    }
    const commandAction = IoC.Resolve<ICommand>(this.idCommand, this.commandArgs);
    commandAction.setTarget(uObject);

    
    game.push(commandAction);
    return Promise.resolve();
  }
  getType(): string {
    return 'InterpretCommand';
  }
}