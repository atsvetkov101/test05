
import { IoC } from '../ioc/ioc';

import { GameObject } from '../game-object';
import { CheckFuelCommand } from '../check-fuel-command';
import { Point } from '../point';
import { Vector } from '../vector';
import { CommandException } from '../command-exception';
import { InitCommand } from '../scopes/init-command';
import { ClearCurrentScopeCommand } from '../scopes/clear-current-scope-command';
import { ManyArgumentsCommand } from '../many-arguments-command';
import { ProcessingQueueCommand } from '../threads/processing-queue-command';
import { HardStopCommand } from '../hard-stop-command';

import { ICommand } from '../interfaces/icommand';
import { FlexibleCommand } from '../flexible-command';
import { KeepProcessingCommand } from '../keep-processing-command';
import { FindObjectCommand } from '../find-object-command';
import { CheckUserAccessUobjectStrategy } from './check-user-access-uobject-strategy';
import { IObjectStorage } from '../interfaces/iobject-storage';
import { ApplicationRuntime } from '../application-runtime';
import { OrderStrategy } from './order-strategy';
import { FindObjectInStorageCommand } from '../find-object-in-storage-command';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));
const gameId = 'rtt213213213';

let gameProcessing;
let gameProcessingQueueCommand;
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
}

describe('OrderStrategy tests', function() {
  describe('dz #13 OrderStrategy tests', function() {
    let messages:string[] = [];
    beforeAll(async () => {
      const originalConsoleLog = console.log;
      jest.spyOn(console, 'log').mockImplementation((message) => {
        messages.push(message);
        // originalConsoleLog(message);
      });
    });
    afterAll(async () => {
      jest.restoreAllMocks();
      const commands = gameProcessing.getCommands();
      gameProcessing.push(new HardStopCommand({commands}));
      const commands1 = gameProcessingQueueCommand.getCommands();
      gameProcessingQueueCommand.push(new HardStopCommand({commands1}));
      await sleep(2000);
      await (new ClearCurrentScopeCommand()).execute();
      if(gameProcessing) {
        await gameProcessing.dispose();
      }
      ApplicationRuntime.setObjectStorage(null);
    });
    it('OrderStrategy', async function() {

      await initTest();

      const message = {
        idGame: gameId,
        idObject:'myobject10',
      };

      const executorUserId = 'Bob';
      gameProcessingQueueCommand = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: message.idGame });
      ApplicationRuntime.setObjectStorage(gameProcessingQueueCommand);

      const strategy = new OrderStrategy(
        message.idGame, 
        message.idObject,
        'FlexibleCommand',
        executorUserId,
        {"initialVelocity": 2}
        );
      const result = await strategy.execute();
      expect(result).toEqual(true);
    });
    
  });
});
