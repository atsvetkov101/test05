import { GameObject } from '../game-object';
import { Pair } from './pair';

export class GameObjectGenericPair<T extends GameObject, U extends GameObject> extends Pair<T, U> {
  constructor(first: T, second: U) {
    super(first, second);
  }
}
