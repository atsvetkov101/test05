import { BurnFuelCommand } from './burn-fuel-command';
import { CheckFuelCommand } from './check-fuel-command';
import { IBurnFuelCommand } from './interfaces/iburn-fuel-command';
import { ICommand } from './interfaces/icommand';
import { IUseFuel } from './interfaces/iusefuel';
import { MacroCommand } from './macro-command';
import { StraightMoveCommand } from './straight-move-command';

export class StraightMoveBurlFuelMacroCommand extends MacroCommand implements ICommand {

  checkFuelCommand: ICommand;
  straightMoveCommand: ICommand;
  burnFuelCommand: IBurnFuelCommand;
  constructor(){
    super();
    this.checkFuelCommand = new CheckFuelCommand();
    this.straightMoveCommand = new StraightMoveCommand();
    this.burnFuelCommand = new BurnFuelCommand();
    this.burnFuelCommand.setFuelToBurn(3);

    this.commands = [
      this.checkFuelCommand,
      this.straightMoveCommand,
      this.burnFuelCommand
    ];
  }

  setFuelToBurn(amount:number) {
    this.burnFuelCommand.setFuelToBurn(amount);
  }

  getFuelToBurn() {
    return this.burnFuelCommand.getFuelToBurn();
  }

  getType(): string {
    throw new Error('Method not implemented.');
  }

  setTarget( object: IUseFuel) {
    this.checkFuelCommand.setTarget(object);
    this.straightMoveCommand.setTarget(object);
    this.burnFuelCommand.setTarget(object);
  }
}