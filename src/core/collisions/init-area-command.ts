import { BaseCommand } from '../base-command';
import { GameObject } from '../game-object';
import { ICommand } from '../interfaces/icommand';
import { AreaObjects } from './area-objects';
import { AreaSystem } from './area-system';
import { AreaSystemFactory } from './area-system-factory';
import { GameObjectHelper } from './game-object-helper';
import { PrepareListOfChecksCommand } from './prepare-list-of-checks-command';

export class InitAreaCommand extends BaseCommand implements ICommand {
  private areaSystem1: AreaSystem;
  private areaSystem2: AreaSystem;
  private objects: GameObject[];
  private areaSystem1Commands = [];
  private areaSystem2Commands = [];
  private areaObjectsSystem1: AreaObjects;
  private areaObjectsSystem2: AreaObjects;
  constructor(options: any = {}) {
    super();
  }
  public execute():  Promise<void> {
    const minX = 0;
    const maxX = 100;
    const minY = 0;
    const maxY = 100;
    const stepX = 10;
    const stepY = 10;
    const initialShiftX = stepX/2;
    const initialShiftY = stepY/2;
    const count = 100;

    const options1 = {
            minX,
            maxX,
            minY,
            maxY,
            stepX,
            initialShiftX: 0,
            stepY,
            initialShiftY: 0,
          };
    
    const options2 = {
            minX,
            maxX,
            minY,
            maxY,
            stepX,
            initialShiftX,
            stepY,
            initialShiftY,
          };

    this.areaSystem1 = AreaSystemFactory.createAreaSystem(options1);

    this.areaSystem2 = AreaSystemFactory.createAreaSystem(options2);
          
    this.objects = GameObjectHelper.generateObjects({
      minX,
      maxX,
      minY,
      maxY,
      count});
    
    this.areaObjectsSystem1 = new AreaObjects(this.areaSystem1);
    this.areaObjectsSystem2 = new AreaObjects(this.areaSystem2);

    this.areaObjectsSystem1.setAreaObjects(this.objects);
    this.areaObjectsSystem2.setAreaObjects(this.objects);

    this.generateCommands();
   
    return Promise.resolve();
  }

  private generateCommands(): ICommand[] {
    for(const object of this.objects){
      this.areaSystem1Commands.push(new PrepareListOfChecksCommand({
        gameObject: object,
        areaSystem: this.areaSystem1,
        areaObjectsSystem: this.areaObjectsSystem1,
        area: this.areaObjectsSystem1.getAssignedArea(object),
      }));
      this.areaSystem2Commands.push(new PrepareListOfChecksCommand({
        gameObject: object,
        areaSystem: this.areaSystem2,
        areaObjectsSystem: this.areaObjectsSystem2,
        area: this.areaObjectsSystem2.getAssignedArea(object),
      }));
    }
    return [];
  }

  getCommands(): ICommand[] {
    return this.areaSystem1Commands.concat(this.areaSystem2Commands);
  }
  getType(): string {
    return 'InitAreaCommand';
  }
  setTarget?(arg0: object): void {
    throw new Error('Method not implemented.');
  }

  getAreaSystem1(): AreaSystem {
    return this.areaSystem1;
  }

  getAreaSystem2(): AreaSystem {
    return this.areaSystem2;
  }

  getObjects(): GameObject[] {
    return this.objects;
  }

  getAreaObjectsSystem1(): AreaObjects {
    return this.areaObjectsSystem1;
  }

  getAreaObjectsSystem2(): AreaObjects {
    return this.areaObjectsSystem2;
  }
}
