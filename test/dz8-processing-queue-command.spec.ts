import { expect, assert } from 'chai';
import sinon from 'sinon';
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
import { FirstCommand } from './first-command';
import { SecondCommand } from './second-command';
import { SoftStopCommand } from '../src/core/soft-stop-command';
import { ICommand } from '../src/core/interfaces/icommand';
import { FlexibleCommand } from '../src/core/flexible-command';
import { KeepProcessingCommand } from '../src/core/keep-processing-command';
import { FindObjectCommand } from '../src/core/find-object-command';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

describe('ProcessingQueueCommand tests', function() {
  describe('dz #8 tests', function() {
    let messages:string[] = [];
    let gameProcessing;
    before(async () => {
      sinon.stub(console, 'log').callsFake((message) => {
        messages.push(message);
      });
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

      const objects = new Map();
      objects.set('myobject1', { id:'myobject1', name:'myname1' });
      objects.set('myobject2', { id:'myobject2', name:'myname2' });
      objects.set('myobject', { id:'myobject', name:'myname' });

      gameProcessing = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: 'mygame', objects });
      const commands = gameProcessing.getCommands();
      const keepProcessingCommand = new KeepProcessingCommand({ 
        commands: commands,
        delayMilliseconds: 1000,
      });
      gameProcessing.push(keepProcessingCommand);      
      gameProcessing.execute();
    });
    after(async () => {
      sinon.restore();
      await sleep(1000);
      const commands = gameProcessing.getCommands();
      gameProcessing.push(new HardStopCommand({commands}));
      await (new ClearCurrentScopeCommand()).execute();
      if(gameProcessing) {
        await gameProcessing.dispose();
      }
    });
    it('InterpretCommand logic test', async function() {

      const message = {
        idGame:'mygame',
        idObject:'myobject',
        idCommand:'FlexibleCommand',
        args: {
          a: 'aaa',
          b: 'bbb',
        }
      };

      const gameProcessingQueueCommand = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: message.idGame });
      const objects = gameProcessingQueueCommand.getObjects();

      const findObjectCommand =  IoC.Resolve<ICommand>('FindObjectCommand', { objects, id: message.idObject } );
      await findObjectCommand.execute();
      const uObject = findObjectCommand.getResult();
      if(!uObject) {
        return;
      }
      const commandAction = IoC.Resolve<ICommand>(message.idCommand, message.args);
      commandAction.setTarget(uObject);

      
      gameProcessingQueueCommand.push(commandAction);
      await sleep(1000);
      
      const flexibleCommandOutput = messages.find((msg) => msg.includes('FlexibleCommand.execute()'));
      const  flexibleCommandUsedMyobject = flexibleCommandOutput.includes('myobject');
      expect(flexibleCommandUsedMyobject).equals(true);
    });
  });
});
