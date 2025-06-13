
import { IoC } from '../core/ioc/ioc';

import { GameObject } from '../core/game-object';
import { CheckFuelCommand } from '../core/check-fuel-command';
import { Point } from '../core/point';
import { Vector } from '../core/vector';
import { CommandException } from '../core/command-exception';
import { InitCommand } from '../core/scopes/init-command';
import { ClearCurrentScopeCommand } from '../core/scopes/clear-current-scope-command';
import { ManyArgumentsCommand } from '../core/many-arguments-command';
import { ProcessingQueueCommand } from '../core/threads/processing-queue-command';
import { HardStopCommand } from '../core/hard-stop-command';

import { ICommand } from '../core/interfaces/icommand';
import { FlexibleCommand } from '../core/flexible-command';
import { KeepProcessingCommand } from '../core/keep-processing-command';
import { FindObjectCommand } from '../core/find-object-command';
import { CheckUserAccessUobjectStrategy } from './interpreter/check-user-access-uobject-strategy';
import { IObjectStorage } from './interfaces/iobject-storage';
import { ApplicationRuntime } from './application-runtime';
import { FindObjectInStorageCommand } from './find-object-in-storage-command';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));
const gameId = 'tdryrtytry';

let gameProcessing;

let findObjectInStorageCommand;
let initialGameProcessing;

const initTest  = async () => {
  await (new InitCommand()).execute();
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
  await IoC.Resolve<ICommand>('IoC.Register', 'FindObjectInStorageCommand', (...args) => {
    return new FindObjectInStorageCommand(args[0]);
  }).execute();

  const objects = [
    { id:'myobject1', name:'myname1', ownerId:'Alex', gameId },
    { id:'myobject2', name:'myname2', ownerId:'Alex', gameId },
    { id:'myobject3', name:'myname3', ownerId:'Alex', gameId },
    { id:'myobject10', name:'myname10', ownerId:'Bob', gameId },
    { id:'myobject13', name:'myname13', ownerId:'Bob', gameId },
    { id:'myobject20', name:'myname20', ownerId:'Alice', gameId }
  ];

  gameProcessing = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: gameId, objects });
  const commands = gameProcessing.getCommands();
  gameProcessing.execute();
  ApplicationRuntime.setObjectStorage(gameProcessing);
}

describe('FindObjectInStorageCommand tests', function() {
  describe('dz #13 FindObjectInStorageCommand tests', function() {
    let messages:string[] = [];
    beforeEach(async () => {
      const originalConsoleLog = console.log;
      jest.spyOn(console, 'log').mockImplementation((message) => {
        messages.push(message);
        originalConsoleLog(message);
      });
    });
    afterEach(async () => {
      jest.restoreAllMocks();
      const commands = gameProcessing.getCommands();
      gameProcessing.push(new HardStopCommand({commands}));
      await sleep(2000);
      await (new ClearCurrentScopeCommand()).execute();
      if(gameProcessing) {
        await gameProcessing.dispose();
      }
      ApplicationRuntime.setObjectStorage(null);
    });
    it('FindObjectInStorageCommand Игровой объект найден', async function() {

      await initTest();

      const message = {
        idGame: gameId,
        idObject:'myobject10',
      };

      findObjectInStorageCommand = await IoC.Resolve<ICommand>('FindObjectInStorageCommand', {
        objectId: message.idObject, 
        gameId: message.idGame 
      });

      findObjectInStorageCommand.execute();
      const uObject = findObjectInStorageCommand.getResult();
      
      expect(uObject).not.toEqual(null);
    });
    it('FindObjectInStorageCommand Игровой объект не найден', async function() {

      await initTest();

      const message = {
        idGame: gameId,
        idObject:'wrondObjectId',
      };

      findObjectInStorageCommand = await IoC.Resolve<ICommand>('FindObjectInStorageCommand', {
        objectId: message.idObject, 
        gameId: message.idGame 
      });

      findObjectInStorageCommand.execute();
      const uObject = findObjectInStorageCommand.getResult();
      
      expect(uObject).not.toBeDefined();
    });
  });
});
