import { GameObject } from '../game-object';
import { ICommand } from '../interfaces/icommand';
import { MacroCommand } from '../macro-command';
import { CheckCollisionCommand } from './check-collision-command';
import { GameObjectPair } from './game-object-pair';

export class CheckCollisionAreaCommand extends MacroCommand implements ICommand {
  private targetObject: GameObject;
  private otherObjects: GameObject[];
  private gameObjectPairs: GameObjectPair[];
  constructor(options: any = {}){
    super();
    this.targetObject = options.targetObject;
    this.otherObjects = options.otherObjects;
    this.gameObjectPairs = this.generatePairs();
    this.commands = this.getCommands(this.gameObjectPairs);
  }

  getType(): string {
    return 'CheckCollisionAreaCommand';
  }

  generatePairs(): GameObjectPair[] {
    const pairs: GameObjectPair[] = [];
    for (let i = 0; i < this.otherObjects.length; i++) {
      pairs.push(new GameObjectPair(this.targetObject, this.otherObjects[i]));
    }
    return pairs;
  }

  getCommands(pairs: GameObjectPair[]){
    const commands: ICommand[] = [];
    for (let i = 0; i < pairs.length; i++) {
      commands.push(new CheckCollisionCommand({ pair: pairs[i] }));
    }
    return commands;
  }
}
