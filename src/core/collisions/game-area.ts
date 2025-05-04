export class GameArea {
  constructor(
    private readonly gameName: string, 
    private readonly minX: number, 
    private readonly maxX: number,
    private readonly minY: number, 
    private readonly maxY: number
  ) {}

  public init(): void {
    // инициализация области игры
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
  public getGameName(): string {
    return this.gameName;
  }
  public isEqual(area: GameArea): boolean {
    const areaJson = JSON.stringify(area);
    const thisJson = JSON.stringify(this);
    return areaJson === thisJson;
  }
}
