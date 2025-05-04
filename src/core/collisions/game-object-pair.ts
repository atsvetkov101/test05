import { GameObject } from '../game-object';
import { GameObjectGenericPair } from './game-object-generic-pair';
import { Pair } from './pair';

export class GameObjectPair extends GameObjectGenericPair<GameObject, GameObject> {
  constructor(first: GameObject, second: GameObject) {
      super(first, second);
  }
}
