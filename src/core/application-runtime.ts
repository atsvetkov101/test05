import { IObjectStorage } from './interfaces/iobject-storage';

export class ApplicationRuntime{
  static storage: IObjectStorage;
  static setObjectStorage(storage: IObjectStorage){
    ApplicationRuntime.storage = storage;
  }
  static getObjectStorage(){
    return ApplicationRuntime.storage;
  }
}
