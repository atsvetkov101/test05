import { Area } from './area';

export class AreaSystem {
  private areas: Area[] = [];

  public addArea(area: Area): void {
    this.areas.push(area);
    
  }

  public getAreas(): Area[] {
    return this.areas;
  }

  public getSize(): number {
    return this.areas.length;
  }

  public getAreaIndex(area: Area): number {
    return this.areas.indexOf(area);
  }
  
}
