import { Vector } from '../vector';
export interface IRotatable {
  getVelocity(): Vector;

  setVelocity( newVector:Vector ): void;
}