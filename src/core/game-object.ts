import { ILocation } from './interfaces/ilocation';
import { IMovable } from './interfaces/imovable';
import { IMoving } from './interfaces/imoving';
import { IRotatable } from './interfaces/irotatable';
import { IUseFuel } from './interfaces/iusefuel';
import { Point } from './point';
import { Vector } from './vector';

class GameObjectParams {
  position?: Point;
  velocity?: Vector;
  fuel?: number;
}

export class GameObject implements IMovable, IRotatable, ILocation, IMoving, IUseFuel {
  position?: Point;
  velocity?: Vector;
  fuel?: number;
  constructor(params: GameObjectParams = {} as GameObjectParams ) {
    const { 
      position = undefined, 
      velocity = undefined,
      fuel = undefined
    } = params;

    this.position = position;
    this.velocity = velocity;
    this.fuel = fuel;
  }
  getFuel(): number {
    return this.fuel;
  }
  refuel(amount: number) {
    this.fuel += amount;
  }
  burn(amount: number) {
    this.fuel -= amount;
    if(this.fuel < 0) {
      this.fuel = 0;
    }
  }
  ableToMove(): boolean {
    return this.fuel > 0;
  }

  getLocation(): Point{
    return this.position;
  }

  setLocation(newPosition: Point): void {
    this.position = newPosition;
  }
  
  getVelocity(): Vector {
    return this.velocity;
  }

  setVelocity(newVelocity: Vector): void {
    this.velocity = newVelocity;
  }

}
