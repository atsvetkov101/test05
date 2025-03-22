import { IMovable } from './interfaces/imovable';
import { IMovement } from './interfaces/imovement';
import { Point } from './point';
import { Vector } from './vector';

export class StraightMovement implements IMovement {
  move (movable: IMovable){
    const location: Point = movable.getLocation();
    if (!location) {
      throw new Error('Невозможно определить положение объекта');
    }
    const velocity: Vector = movable.getVelocity();
    if (!velocity) {
      throw new Error('Невозможно определить скорость объекта');
    }

    const newLocation: Point = location.add(velocity);
    movable.setLocation(newLocation);
  }
}
