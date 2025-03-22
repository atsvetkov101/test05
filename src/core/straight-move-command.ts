import { ICommand } from './interfaces/icommand';
import { IMovable } from './interfaces/imovable';
import { IMovement } from './interfaces/imovement';
import { IMoving } from './interfaces/imoving';
import { StraightMovement } from './straight-movement';
import { logger } from './logger';
import { Point } from './point';
import { Vector } from './vector';
import { BaseCommand } from './base-command';

export class StraightMoveCommand extends BaseCommand implements ICommand {
  target: IMovable;
  movement: IMovement;

  constructor(){
    super();
    this.movement = new StraightMovement();
  }

  execute(): void {
    if(this.target) {
      this.logTarget();
      this.movement.move(this.target);
      this.logTarget();
    }
  }
  getType(): string {
    return 'StraightMoveCommand';
  }

  setTarget( object: IMovable) {
    this.target = object;
  }
}