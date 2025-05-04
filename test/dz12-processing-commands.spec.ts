import { expect, assert } from 'chai';
import sinon from 'sinon';
import { IoC } from '../src/core/ioc/ioc';

import { InitCommand } from '../src/core/scopes/init-command';
import { ProcessingQueueCommand } from '../src/core/threads/processing-queue-command';
import { HardStopCommand } from '../src/core/hard-stop-command';
import { ICommand } from '../src/core/interfaces/icommand';
import { KeepProcessingCommand } from '../src/core/keep-processing-command';
import { FindObjectCommand } from '../src/core/find-object-command';
import { InitAreaCommand } from '../src/core/collisions/init-area-command';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

describe('Processing Commands tests', function() {
  describe('dz #12 tests', function() {
    const testGameName = 'gameName5678';
    let messages:string[] = [];
    let gameProcessing;
    before(async () => {
      sinon.stub(console, 'log').callsFake((message) => {
        messages.push(message);
      });
      await (new InitCommand()).execute();
      await IoC.Resolve<ICommand>('IoC.Register', 'ProcessingQueueCommand', (...args) => {
        const cmd = new ProcessingQueueCommand(args[0]);
        return cmd;
      }).execute();
      await IoC.Resolve<ICommand>('IoC.Register', 'InitAreaCommand', (...args) => {
        const cmd = new InitAreaCommand(args[0]);
        return cmd;
      }).execute();

      

    });
    after(async () => {
      sinon.restore();
      await sleep(1000);
      if(gameProcessing) {
        const commands = gameProcessing.getCommands();
        gameProcessing.push(new HardStopCommand({commands}));
      }
      // await (new ClearCurrentScopeCommand()).execute();
      if(gameProcessing) {
        await gameProcessing.dispose();
      }
    });
    it('Processing Commands test', async function() {

      const initAreaCommand = IoC.Resolve<ICommand>('InitAreaCommand', {});
      await initAreaCommand.execute();
      const collisionCommands = initAreaCommand.getCommands();

      gameProcessing = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: testGameName });
      const commands = gameProcessing.getCommands();
      for(let i = 0; i < collisionCommands.length; i++) {
        collisionCommands[i].setCommandsQueue(commands);
        gameProcessing.push(collisionCommands[i]);
      };
      gameProcessing.execute();
      await sleep(1000);
      
      const numberOfChecks = messages.filter((item) => item.includes('executing command CheckCollisionAreaCommand'));
      expect(numberOfChecks.length).lessThan(500);
    });
  });
});
