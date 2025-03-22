import { Vector } from './vector';

export class Point {
  x = 0;
  y = 0;
  constructor(x: number, y: number) { 
    this.x = x;
    this.y = y;
  }
  /*
  add(x: number, y: number) {
    const newX = this.x + x;
    const newY = this.y + y;
    return new Point(newX, newY);
  }

  add(vector: Vector) {
    return this.add(vector.x, vector.y);
  }
*/
   
  add(vector: Vector) {
    const newX = this.x + vector.x;
    const newY = this.y + vector.y;
    return new Point(newX, newY);
  }

  toString() {
    return `x:${this.x} y:${this.y}`;
  }
}