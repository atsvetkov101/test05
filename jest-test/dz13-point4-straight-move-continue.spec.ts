
import { IoC } from '../src/core/ioc/ioc';

import { GameObject } from '../src/core/game-object';
import { CheckFuelCommand } from '../src/core/check-fuel-command';
import { Point } from '../src/core/point';
import { Vector } from '../src/core/vector';
import { CommandException } from '../src/core/command-exception';
import { InitCommand } from '../src/core/scopes/init-command';
import { ClearCurrentScopeCommand } from '../src/core/scopes/clear-current-scope-command';
import { ManyArgumentsCommand } from '../src/core/many-arguments-command';
import { ProcessingQueueCommand } from '../src/core/threads/processing-queue-command';
import { HardStopCommand } from '../src/core/hard-stop-command';

import { ICommand } from '../src/core/interfaces/icommand';
import { FlexibleCommand } from '../src/core/flexible-command';
import { KeepProcessingCommand } from '../src/core/keep-processing-command';
import { FindObjectCommand } from '../src/core/find-object-command';
import { CheckUserAccessUobjectStrategy } from '../src/core/interpreter/check-user-access-uobject-strategy';
import { IObjectStorage } from '../src/core/interfaces/iobject-storage';
import { ApplicationRuntime } from '../src/core/application-runtime';
import { OrderStrategy } from '../src/core/interpreter/order-strategy';
import { FindObjectInStorageCommand } from '../src/core/find-object-in-storage-command';
import { OrderExecutionCommand } from '../src/core/interpreter/order-execution-command';
import { StraightMoveCommand } from '../src/core/straight-move-command';
import { StraightMoveContinueCommand } from '../src/core/interpreter/straight-move-continue-command';


const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));
const gameId = 'rtt3424234';

const myobject1 = new GameObject({ 
    position: new Point(12, 5), 
    velocity: new Vector(-7, 3), 
    fuel: 0
  });

  myobject1['id'] = 'myobject1';
  myobject1['name'] = 'myname1';
  myobject1['ownerId'] = 'Alex';
  myobject1['gameId'] = gameId;

  const myobject10 = new GameObject({ 
    position: new Point(10, 6), 
    velocity: new Vector(1, 1), 
    fuel: 0
  });

  myobject10['id'] = 'myobject10';
  myobject10['name'] = 'myname10';
  myobject10['ownerId'] = 'Bob';
  myobject10['gameId'] = gameId;

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
  await IoC.Resolve<ICommand>('IoC.Register', 'StraightMoveContinueCommand', (...args) => {
    return new StraightMoveContinueCommand(args[0]);
  }).execute();

  const objects = [
    myobject1, myobject10
  ];
  gameProcessing = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: gameId, objects });
  const commands = gameProcessing.getCommands();
  gameProcessing.execute();
}

describe('dz13-point4-straight-move-continue с помощью этого интерпретатора можно обработать приказ на старт движения', function() {
  describe('dz #13 straight-move-continue приказ на старт движения', function() {
    let messages:string[] = [];
    beforeAll(async () => {
      const originalConsoleLog = console.log;
      jest.spyOn(console, 'log').mockImplementation((message) => {
        messages.push(message);
        originalConsoleLog(message);
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
    it('OrderExecutionCommand straight-move-continue приказ на старт движения. Проверяем, что объект двигается', async function() {
      const executorUserId = 'Bob';
      await initTest();

      const order = {
        idGame: gameId,
        uObjectid: 'myobject10',
        currentUserId: executorUserId,
        action: 'StraightMoveContinueCommand',
        initialVelocity: 2,
        interval: 1000,
      };
      
      gameProcessingQueueCommand = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: order.idGame });
      ApplicationRuntime.setObjectStorage(gameProcessingQueueCommand);
      
      const command = new OrderExecutionCommand(order);

      const originalLocation = myobject10.getLocation();
      const myobject1Location = myobject1.getLocation();
      gameProcessingQueueCommand.push(command);

      const strings = [];
      const X = [];
      const Y = [];
      for (let i = 0; i < 5; i++) {
        await sleep(2000);
        const newLocation = myobject10.getLocation();
        console.log(`x:${newLocation.x} y:${newLocation.y}`);
        X.push(newLocation.x);
        Y.push(newLocation.y);
        strings.push(`x:${newLocation.x} y:${newLocation.y}`);
       
      }
      console.log(strings.join('\n'));

      const commands = gameProcessing.getCommands();
      gameProcessing.push(new HardStopCommand({commands}));
      await sleep(2000);
 
      expect(X.length).toEqual(5);

      expect(X[0]).not.toEqual(X[1]);
      expect(X[1]).not.toEqual(X[2]);
      expect(X[2]).not.toEqual(X[3]);
      expect(X[3]).not.toEqual(X[4]);

      expect(Y.length).toEqual(5);  
      expect(Y[0]).not.toEqual(Y[1]);
      expect(Y[1]).not.toEqual(Y[2]);
      expect(Y[2]).not.toEqual(Y[3]);
      expect(Y[3]).not.toEqual(Y[4]);
      

    });
  });
});
