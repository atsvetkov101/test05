import { ApplicationRuntime } from './application-runtime';
import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';

export class FindObjectInStorageCommand extends BaseCommand implements ICommand {
  protected objectId:string;
  protected gameId:string;
  protected uObject:any;
  constructor(options: any) {
    super();
    this.objectId = options.objectId;
    this.gameId = options.gameId;
  }

  execute(): Promise<void> {
    const storage = ApplicationRuntime.getObjectStorage();
    const objects = storage.getObjects(this.gameId);
    const uObject = objects.find((item) => item.id === this.objectId);
    this.uObject = uObject
    return Promise.resolve();
  }

  getResult(){
    return this.uObject;
  }

  getType(): string {
    return 'FindObjectInStorageCommand';
  }
}