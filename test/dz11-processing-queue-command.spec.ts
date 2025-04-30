import { expect, assert } from 'chai';
import sinon from 'sinon';

import { GameObject } from '../src/core/game-object';
import { CheckFuelCommand } from '../src/core/check-fuel-command';
import { Point } from '../src/core/point';
import { Vector } from '../src/core/vector';
import { CommandException } from '../src/core/command-exception';
import { BurnFuelCommand } from '../src/core/burn-fuel-command';
import { StraightMoveCommand } from '../src/core/straight-move-command';
import { KeepProcessingCommand } from '../src/core/keep-processing-command';
import { ProcessingQueueCommand } from '../src/core/threads/processing-queue-command';
import { HardStopCommand } from '../src/core/hard-stop-command';
import { FirstCommand } from './first-command';
import { SecondCommand } from './second-command';
import { SoftStopCommand } from '../src/core/soft-stop-command';
import { ProcessingQueueStateCommand } from '../src/core/threads/processing-queue-state-command';
import { HardStopStateCommand } from '../src/core/hard-stop-state-command';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

describe('ProcessingQueueCommand tests', function() {
  describe('dz #11 tests', function() {
    const messages:string[] = [];
    let logged;
    let gameProcessing;
    before(() => {
      sinon.stub(console, 'log').callsFake((message) => {
        logged = message;
        messages.push(message);
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    after(() => {
      if(gameProcessing) {
        gameProcessing.dispose();
      }
      sinon.restore();
    }); 
    it('dz #11 тест проверяет, что обработка очереди с поддержкой состояния работает ProcessingQueueStateCommand ', async function() {
      const commands = [];
      const checkFuelCommand = new CheckFuelCommand();
      const straightMoveCommand = new StraightMoveCommand();
      const burnFuelCommand = new BurnFuelCommand();
      burnFuelCommand.setFuelToBurn(3);
      
      commands.push(checkFuelCommand);
      commands.push(straightMoveCommand);
      commands.push(burnFuelCommand);
      
      commands.push(new FirstCommand());
      commands.push(new SoftStopCommand({ commands }));
  
      gameProcessing = new ProcessingQueueStateCommand();
      gameProcessing.setCommands(commands);
      await gameProcessing.execute();
      await sleep(1000);
      expect(messages.find((item) => item.includes('executing command CheckFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command StraightMoveCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command BurnFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command FirstCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('SoftStopCommand')) !== undefined).equals(true);
      await sleep(1000);
    });
  });
  describe('dz #11 tests Hard stop', function() {
    const messages:string[] = [];
    let logged;
    let gameProcessing;
    before(() => {
      sinon.stub(console, 'log').callsFake((message) => {
        logged = message;
        messages.push(message);
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    after(() => {
      if(gameProcessing) {
        gameProcessing.dispose();
      }
      sinon.restore();
    }); 
    it('dz #11 point 5 Написать тест, который проверяет, что после команды hard stop, поток завершается', async function() {
      const commands = [];
      const checkFuelCommand = new CheckFuelCommand();
      const straightMoveCommand = new StraightMoveCommand();
      const burnFuelCommand = new BurnFuelCommand();
      burnFuelCommand.setFuelToBurn(3);
      
      gameProcessing = new ProcessingQueueStateCommand();
      gameProcessing.setCommands(commands);

      commands.push(new FirstCommand());
      commands.push(new HardStopStateCommand({ processingCommand: gameProcessing }));
      commands.push(checkFuelCommand);
      commands.push(straightMoveCommand);
      commands.push(burnFuelCommand);

      await gameProcessing.execute();
      expect(messages.find((item) => item.includes('executing command FirstCommand')) !== undefined).equals(true);
      expect(messages[messages.length-1].includes('HardStopCommand')).equals(true);
      expect(messages.find((item) => item.includes('executing command CheckFuelCommand')) !== undefined).equals(false);
      expect(messages.find((item) => item.includes('executing command StraightMoveCommand')) !== undefined).equals(false);
      expect(messages.find((item) => item.includes('executing command BurnFuelCommand')) !== undefined).equals(false);
    });
  });
});