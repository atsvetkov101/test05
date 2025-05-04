import { GameObject } from '../game-object';

export class CollisionDetector{
  private static count = 0;
  public static detect(first: GameObject, second: GameObject): boolean {
    /* метод, который умеет для двух игровых объектов определять коллизию 
    - столкнулись эти два объекта или нет. 
    Эту функцию/процедуру/метод реализовывать не нужно, так это достаточно большая задача.
    */
    CollisionDetector.count++;
    return true;
  }
}
