import { BaseCommand } from './base-command';
import { CommandException } from './command-exception';
import { ICommand } from './interfaces/icommand';
import { IUseFuel } from './interfaces/iusefuel';

export class CheckFuelCommand extends BaseCommand implements ICommand {

  target: IUseFuel;
  
  execute(): Promise<void> {
    if(this.target) {
      this.logTarget();
      const ableToMove = this.target.ableToMove();
      if (!ableToMove) {
        throw new CommandException('CheckFuelCommand generated error');
      }
      return Promise.resolve();
    }else{
      return Promise.reject();
    }
  }
  getType(): string {
    return 'CheckFuelCommand';
  }

  setTarget( object: IUseFuel) {
    this.target = object;
  }

  logTarget() {
    if(this.target && this.verbose) {
      // eslint-disable-next-line max-len
      this.logger.log(`CheckFuelCommand fuel: ${this.target.getFuel() || '-'} ableToMove: ${this.target.ableToMove()  || '-'}`);
    }
  }
}