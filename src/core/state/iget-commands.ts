import { ICommand } from '../interfaces/icommand';

export interface IGetCommands {
  getCommands(): Promise<ICommand[]>;
}
