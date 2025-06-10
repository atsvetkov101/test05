import { GameObject } from '../game-object';
import { Point } from '../point';

interface GenerateObjectOptions {
  count: number;
  minX: number;
  maxX: number; 
  minY: number; 
  maxY: number;
}

interface AreaOptions {
  minX: number;
  maxX: number; 
  minY: number; 
  maxY: number;
}

export class GameObjectHelper {
  public static generateObjects(options: GenerateObjectOptions): GameObject[]{
    const { count, ...AreaOptions } = options;
    const objects: GameObject[] = [];
    for(let i = 0; i < count; i++){
      objects.push(GameObjectHelper.generateObject(AreaOptions));
    }
    return objects;
  }
  private static generateObject(options: AreaOptions): GameObject {
    const x = Math.random() * (options.maxX - options.minX) + options.minX;
    const y = Math.random() * (options.maxY - options.minY) + options.minY;
    return new GameObject({ position: new Point(x, y)});
  }
  
}
