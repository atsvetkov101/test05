import { GameObject } from '../game-object';
import { Area } from './area';
import { AreaSystem } from './area-system';

export class AreaObjects{
  private areaSystem : AreaSystem;
  private areaObjects: GameObject[][] = [];
  constructor(areaSystem : AreaSystem){
    this.areaSystem = areaSystem;  
    this.areaObjects = new Array(areaSystem.getSize());
  }
  
  public setAreaObjects(objects: GameObject[]){
    objects.forEach((object) => {
      const area = this.chooseArea(object);
      if (area) {
        this.insertObject(this.areaSystem.getAreaIndex(area), object);
      }
    });
  }

  public getObjectsInArea(area: any){
    return this.areaObjects[this.areaSystem.getAreaIndex(area)];
  }

  public getObjectsInAreaExtended(area: any, excludeObjects: GameObject[]){
    const objects = this.getObjectsInArea(area); // all objects in this area
    return objects.filter((object) => {
      return excludeObjects.indexOf(object) === -1;
    });
  }

  public chooseArea(object: GameObject){
    return this.areaSystem.getAreas().find(
      (area) => {
      if (object.getLocation().x > area.getMinX() 
        && object.getLocation().x < area.getMaxX() 
        && object.getLocation().y > area.getMinY()
        && object.getLocation().y < area.getMaxY()){
          return area;
      } else {
        return null;
      }
    });
  }

  private insertObject(areaIndex: number, object: any) {
    if(this.areaObjects[areaIndex] === undefined) {
      this.areaObjects[areaIndex] = [];
    }
    this.areaObjects[areaIndex].push(object);
  }

  public addObjectToArea(area: Area, object: any) {
    const areaIndex = this.areaSystem.getAreaIndex(area);
    this.insertObject(areaIndex, object);
  }

  public removeObjectFromArea(area: Area, object: any) {
    const areaIndex = this.areaSystem.getAreaIndex(area);
    this.deleteObject(areaIndex, object);
  }
  private deleteObject(areaIndex: number, object: any) {
    const objectIndex = this.areaObjects[areaIndex].indexOf(object, 0);
    if (objectIndex > -1) {
      this.areaObjects[areaIndex].splice(objectIndex, 1);
    }
  }

  public get AllAreaObjects() {
    return this.areaObjects;
  }

  public getAssignedArea (object: GameObject){
   for(let i = 0; i < this.areaObjects.length; i++){
      if(this.areaObjects[i] && this.areaObjects[i].includes(object)){
        return this.areaSystem.getAreas()[i];
      }
   }
   return null;
  }
}
