import { BaseCommand } from '../base-command';
import { GameObject } from '../game-object';
import { ICommand } from '../interfaces/icommand';
import { Area } from './area';
import { AreaObjects } from './area-objects';
import { AreaSystem } from './area-system';
import { CheckCollisionAreaCommand } from './check-collision-area-command';
import { GameArea } from './game-area';

export class PrepareListOfChecksCommand extends BaseCommand implements ICommand {
  private commandsQueue;
  private gameObject: GameObject;
  private areaSystem: AreaSystem;
  private areaObjectsSystem: AreaObjects;
  private area: Area;
  constructor(options: any){
    super();
    this.commandsQueue = options.commandsQueue;
    this.gameObject = options.gameObject;
    this.areaSystem = options.areaSystem;
    this.areaObjectsSystem = options.areaObjectsSystem;
    this.area = options.area;
  }
  execute(): Promise<void> {
    const assignedArea = this.areaObjectsSystem.getAssignedArea(this.gameObject);
    if(!this.area.isEqual(assignedArea)){
      
      this.areaObjectsSystem.removeObjectFromArea(this.area, this.gameObject);
      this.area = assignedArea;
      this.areaObjectsSystem.addObjectToArea(this.area, this.gameObject);
    }
    // Выбираем список объектов игры из текущей окрестности, кроме выбраного
    const otherObjects = this.areaObjectsSystem.getObjectsInAreaExtended(this.area, [this.gameObject]);
    if(otherObjects.length > 0) {
      this.commandsQueue.push(new CheckCollisionAreaCommand({
        targetObject:this.gameObject,
        otherObjects
       }));
    }

    return Promise.resolve();
  }

  setCommandsQueue(commandsQueue: ICommand[]){
    this.commandsQueue = commandsQueue;
  }
  getType(): string {
    return 'PrepareListOfChecksCommand';
  }
}
