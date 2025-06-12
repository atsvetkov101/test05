import { ICommand } from '../interfaces/icommand';
import { IObjectStorage } from '../interfaces/iobject-storage';
import { IoC } from '../ioc/ioc';
import { ApplicationRuntime } from '../application-runtime';

export class CheckUserAccessUobjectStrategy{
  protected objectStorage: IObjectStorage;
  constructor(protected gameId: string, 
    protected objectId: string, 
    protected executorUserId: string,
    objectStorage: IObjectStorage = null) {
      if(objectStorage === null) {
        const appObjectStorage = ApplicationRuntime.getObjectStorage();
        if (!appObjectStorage) {
          throw new Error('Не задано глобальное хранилище объектов Application Object Storage');
        }
        this.objectStorage = appObjectStorage;
      } else {
        this.objectStorage = objectStorage;
      }

  }
  execute(): boolean {
    const ownerId = this.getObjectOwnerId();
    if (!ownerId) {
      return false;
    }
    return this.executorUserId === ownerId;
  }

  getObjectOwnerId(): string | null | undefined {
    const objects = this.objectStorage.getObjects(this.gameId);
    const object = objects.find((item) => {
      return item.id === this.objectId
    });
    return object ? object['ownerId'] : null;
  }
}