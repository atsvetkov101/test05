
import { IoC } from '../../core/ioc/ioc';

import { GameObject } from '../../core/game-object';
import { CheckFuelCommand } from '../../core/check-fuel-command';
import { Point } from '../../core/point';
import { Vector } from '../../core/vector';
import { CommandException } from '../../core/command-exception';
import { InitCommand } from '../../core/scopes/init-command';
import { ClearCurrentScopeCommand } from '../../core/scopes/clear-current-scope-command';
import { ManyArgumentsCommand } from '../../core/many-arguments-command';
import { ProcessingQueueCommand } from '../../core/threads/processing-queue-command';
import { HardStopCommand } from '../../core/hard-stop-command';

import { ICommand } from '../../core/interfaces/icommand';
import { FlexibleCommand } from '../../core/flexible-command';
import { KeepProcessingCommand } from '../../core/keep-processing-command';
import { FindObjectCommand } from '../../core/find-object-command';
import { CheckUserAccessUobjectStrategy } from './check-user-access-uobject-strategy';
import { IObjectStorage } from '../interfaces/iobject-storage';
import { ApplicationRuntime } from '../application-runtime';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));
const gameId = 'kjgdsfgdsaf';

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

describe('CheckUserAccessUobjectStrategy tests', function() {
  describe('dz #13 CheckUserAccessUobjectStrategy tests', function() {
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
    });
    it('CheckUserAccessUobjectStrategy Проверяем, что Bob может отправлять сообщения своим объектам', async function() {

      await initTest();

      const message = {
        idGame: gameId,
        idObject:'myobject10',
      };

      const executorUserId = 'Bob';
      gameProcessingQueueCommand = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: message.idGame });
      ApplicationRuntime.setObjectStorage(gameProcessingQueueCommand);

      const strategy = new CheckUserAccessUobjectStrategy(
        message.idGame, 
        message.idObject,
        executorUserId);
      const result = strategy.execute();
      expect(result).toEqual(true);
    });
    it('CheckUserAccessUobjectStrategy Проверяем, что Alice не может отправлять сообщения объектам, которые ей не принадлежат', async function() {

      await initTest();

      const message = {
        idGame: gameId,
        idObject:'myobject10',
      };

      const executorUserId = 'Alice';
      const gameProcessingQueueCommand = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: message.idGame });
      ApplicationRuntime.setObjectStorage(gameProcessingQueueCommand);

      await sleep(1000);

      const strategy = new CheckUserAccessUobjectStrategy(
        message.idGame, 
        message.idObject,
        executorUserId);
      const result = strategy.execute();
      expect(result).toEqual(false);
    });
  });
});
