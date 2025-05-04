import { GameObjectPair } from './game-object-pair';

export class CollisionRepository{
  private static instance: CollisionRepository;
  private detectedCollisions: GameObjectPair[] = [];
  private constructor(){}
  public static getInstance(): CollisionRepository{
    if(!CollisionRepository.instance){
      CollisionRepository.instance = new CollisionRepository();
    }
    return CollisionRepository.instance;
  }
  public add(pair: GameObjectPair): void{
    this.detectedCollisions.push(pair);
  }
}