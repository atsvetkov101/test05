export class Vector {
  x = 0;
  y = 0;
  constructor(x: number, y: number) { 
    this.x = x;
    this.y = y;
  }

  toString() {
    return `x:${this.x} y:${this.y}`;
  }
}