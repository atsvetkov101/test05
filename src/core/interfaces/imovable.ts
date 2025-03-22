import { Point } from '../point';
import { Vector } from '../vector';
export interface IMovable {
  getLocation(): Point | undefined;

  getVelocity(): Vector | undefined;

  setLocation(newLocation: Point): void;
}
