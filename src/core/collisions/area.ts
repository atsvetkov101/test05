export class Area {
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;

  constructor(minX: number, maxX: number, minY: number, maxY: number) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }

  public getMinX(): number {
    return this.minX;
  }

  public getMaxX(): number {
    return this.maxX;
  }

  public getMinY(): number {
    return this.minY;
  }

  public getMaxY(): number {
    return this.maxY;
  }
  public isEqual(area: Area): boolean {
    const areaJson = JSON.stringify(area);
    const thisJson = JSON.stringify(this);
    return areaJson === thisJson;
  }
}