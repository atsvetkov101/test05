import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';
import { IRotatable } from './interfaces/irotatable';
import { IRotation } from './interfaces/irotation';
import { Rotation } from './rotation';

export class RotateCommand extends BaseCommand implements ICommand {
  target: IRotatable;
  rotation: IRotation;
  constructor(){
    super();
    this.rotation = new Rotation();
  }

  execute(): Promise<void> {
    if(this.target) {
      this.logTarget();
      this.rotation.rotate(this.target);
      this.logTarget();
    }
    return Promise.resolve();
  }

  getType(): string {
    return 'RotateCommand';
  }

  setTarget( object: IRotatable) {
    this.target = object;
  }
}