import { Injectable } from '@nestjs/common';
import { GameCommand } from '../../core/game/game-command';
import { CheckFuelCommand } from '../../core/check-fuel-command';
import { StraightMoveCommand } from '../../core/straight-move-command';
import { BurnFuelCommand } from '../../core/burn-fuel-command';
import { ICommand } from '../../core/interfaces/icommand';
import { HardStopCommand } from '../../core/hard-stop-command';
import { KeepProcessingCommand } from '../../core/keep-processing-command';
@Injectable()
export class ConsoleService {

  private commands: ICommand[];
  private delayMilliseconds: number = 10000;
  constructor() {
    this.init();
  }
  init() {
    this.commands = [];
    const checkFuelCommand = new CheckFuelCommand();
    const straightMoveCommand = new StraightMoveCommand();
    const burnFuelCommand = new BurnFuelCommand();
    burnFuelCommand.setFuelToBurn(3);
    const keepProcessingCommand = new KeepProcessingCommand({ 
      commands: this.commands,
      delayMilliseconds: this.delayMilliseconds,
    });

    this.commands.push(checkFuelCommand);
    this.commands.push(straightMoveCommand);
    this.commands.push(burnFuelCommand);
    this.commands.push(keepProcessingCommand);
    /*
    this.commands = [
      checkFuelCommand,
      straightMoveCommand,
      burnFuelCommand
    ];
    */
  }

  async startProcessing() {
    // TODO: instantiate Game and start
    const game:GameCommand = new GameCommand();
    game.setCommands(this.commands);
    setTimeout(() => {
      this.commands.push(new HardStopCommand({ commands: this.commands }));
    }, 30000);
    await game.execute();

  }
	getHello(): string {
		return 'Hello World!';
	}
}
