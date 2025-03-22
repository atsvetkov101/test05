import { IRotatable } from './interfaces/irotatable';
import { IRotation } from './interfaces/irotation';
import { Vector } from './vector';

export class Rotation implements IRotation {

  rotate( rotatable:IRotatable ): void{
    const velocity: Vector = rotatable.getVelocity();
    const newVelocity = this.calculateVector(velocity);
    rotatable.setVelocity(newVelocity);
  }

  calculateVector(vector:Vector): Vector {
    const angle = Math.PI/2;
    const rotatedX = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
    const rotatedY = vector.x * Math.sin(angle) + vector.y * Math.cos(angle);
    return new Vector(rotatedX, rotatedY);
  }
}
