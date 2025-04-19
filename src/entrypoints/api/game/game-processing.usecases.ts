import { Injectable } from '@nestjs/common';

import { InitCommand } from '../../../core/scopes/init-command';
import { IoC } from '../../../core/ioc/ioc';
import { FlexibleCommand } from '../../../core/flexible-command';
import { ICommand } from '../../../core/interfaces/icommand';
import { FindObjectCommand } from '../../../core/find-object-command';
import { InterpretCommand } from '../../../core/interpret-command';
import { KeepProcessingCommand } from '../../../core/keep-processing-command';
import { ProcessingQueueCommand } from '../../../core/threads/processing-queue-command';
import { Utils } from '../../../core/util/utils';
import { HardStopCommand } from '../../../core/hard-stop-command';

@Injectable()
export class GameProcessingUsecases {
	constructor(
  ) {}

	async startGame(gameId: string, logins: string[] = []) {
    await (new InitCommand()).execute();
    IoC.setCurrenScope(gameId);
    if(logins.length > 0) {
      IoC.setUserLogins(logins);
    }
    await IoC.Resolve<ICommand>('IoC.Register', 'FlexibleCommand', (...args) => {
      return new FlexibleCommand(args);
    }).execute();
    await IoC.Resolve<ICommand>('IoC.Register', 'ProcessingQueueCommand', (...args) => {
      const cmd = new ProcessingQueueCommand(args[0]);
      return cmd;
    }).execute();
    await IoC.Resolve<ICommand>('IoC.Register', 'FindObjectCommand', (...args) => {
      return new FindObjectCommand(args[0]);
    }).execute();

    await IoC.Resolve<ICommand>('IoC.Register', 'InterpretCommand', (...args) => {
      return new InterpretCommand(args[0]);
    }).execute();

    const objects = new Map();
    objects.set('myobject1', { id:'myobject1', name:'myname1' });
    objects.set('myobject2', { id:'myobject2', name:'myname2' });
    objects.set('myobject', { id:'myobject', name:'myname' });

    const gameProcessing = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: gameId, objects });
    return gameProcessing.execute();
  }

  async startGames(gameIds: string[]){
    const calls = gameIds.map((gameId) => this.startGame(gameId));
    return Promise.all(calls);
  }
 
  private generateGameId(): string {
    return Utils.generateRandomString();
  }

  async startNewGameByUser(userLogins: string[]): Promise<string> {
    const gameId = this.generateGameId();
    await this.startGame(gameId, userLogins);
    return Promise.resolve(gameId);
  }
}
