import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';
import { IUseFuel } from './interfaces/iusefuel';

export class BurnFuelCommand extends BaseCommand implements ICommand {

  target: IUseFuel;
  fuelToBurn: number;
  constructor(){
    super();
  }

  execute(): void {
    if(this.target) {
      this.logTarget();
      this.target.burn(this.fuelToBurn);
      this.logTarget();
    }
  }
  getType(): string {
    return 'BurnFuelCommand';
  }

  setTarget( object: IUseFuel) {
    this.target = object;
  }

  logTarget() {
    if(this.target && this.verbose) {
      // eslint-disable-next-line max-len
      this.logger.log(`BurnFuelCommand fuel: ${this.target.getFuel() || '-'} ableToMove: ${this.target.ableToMove()  || '-'}`);
    }
  }

  setFuelToBurn( amount:number ) {
    this.fuelToBurn = amount;
  }

  getFuelToBurn() {
    return this.fuelToBurn;
  }
}