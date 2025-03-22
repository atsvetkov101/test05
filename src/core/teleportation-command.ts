import { ICommand } from './interfaces/icommand';
import { IMovable } from './interfaces/imovable';
import { IMovement } from './interfaces/imovement';
import { IMoving } from './interfaces/imoving';
import { StraightMovement } from './straight-movement';
import { logger } from './logger';
import { Point } from './point';
import { Vector } from './vector';
import { BaseCommand } from './base-command';
import { ILocation } from './interfaces/ilocation';

export class TeleportationCommand extends BaseCommand implements ICommand, ILocation {
  target: IMovable;

  position? : Point;

  constructor( newPosition: Point ){
    super();
    this.position = newPosition;
  }

  execute(): void {
    if(this.target) {
      this.logTarget();
      this.target.setLocation(this.position);
      this.logTarget();
    }
  }
  getType(): string {
    return 'TeleportationCommand';
  }

  setTarget( object: IMovable) {
    this.target = object;
  }
}