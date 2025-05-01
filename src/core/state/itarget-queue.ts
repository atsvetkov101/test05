import { ICommand } from '../interfaces/icommand';

export interface ITargetQueue {
  getTargetQueue(): Promise<ICommand[]>;
}
