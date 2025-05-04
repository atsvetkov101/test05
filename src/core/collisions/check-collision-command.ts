import { BaseCommand } from '../base-command';
import { GameObject } from '../game-object';
import { ICommand } from '../interfaces/icommand';
import { MacroCommand } from '../macro-command';
import { CollisionDetector } from './collision-detector';
import { CollisionRepository } from './collision-repository';
import { GameObjectPair } from './game-object-pair';

export class CheckCollisionCommand extends BaseCommand implements ICommand {
  private pair: GameObjectPair;  
  private result: boolean;
  constructor(options: any = {}){
    super();
    this.pair = options.pair;
  }

  execute(): Promise<void> {
    const detected = CollisionDetector.detect(this.pair.getFirst(), this.pair.getSecond());
    if(detected){
      CollisionRepository.getInstance().add(this.pair);
    }
    return Promise.resolve();
  }
  getType(): string {
    return 'CheckCollisionCommand';
  }
}