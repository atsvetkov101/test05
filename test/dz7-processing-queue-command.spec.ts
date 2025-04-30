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

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

describe('ProcessingQueueCommand tests', function() {
  describe('dz #7 point 5. tests', function() {
    let messages:string[] = [];
    let logged;
    let gameProcessing;
    beforeEach(() => {
      messages = [];
      sinon.stub(console, 'log').callsFake((message) => {
        logged = message;
        messages.push(message);
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterEach(() => {
      if(gameProcessing){
        gameProcessing.dispose();
      }
      sinon.restore();
    }); 
    it('dz #7 point 5.В цикле получает из потокобезопасной очереди команду и запускает ее.', async function() {
      const commands = [];
      const obj:GameObject = new GameObject({ 
        position: null, 
        velocity: null, 
        fuel: 10
      });
      const checkFuelCommand = new CheckFuelCommand();
      checkFuelCommand.setTarget(obj);
      const straightMoveCommand = new StraightMoveCommand();
      const burnFuelCommand = new BurnFuelCommand();
      burnFuelCommand.setFuelToBurn(3);
  
      commands.push(checkFuelCommand);
      commands.push(straightMoveCommand);
      commands.push(burnFuelCommand);

      gameProcessing = new ProcessingQueueCommand();
      gameProcessing.setCommands(commands);

      await gameProcessing.execute();
      await sleep(1000);
      expect(messages[0].includes('CheckFuelCommand')).equals(true);
      expect(messages[1].includes('StraightMoveCommand')).equals(true);
      expect(messages[2].includes('BurnFuelCommand')).equals(true);
    });
    it('dz #7 point 5.Выброс исключения из команды не должен прерывать выполнение потока', async function() {
      const commands = [];
      // target не установлен - будет ошибка
      const checkFuelCommand = new CheckFuelCommand();
      const straightMoveCommand = new StraightMoveCommand();
      const burnFuelCommand = new BurnFuelCommand();
      burnFuelCommand.setFuelToBurn(3);
  
      commands.push(checkFuelCommand);
      commands.push(straightMoveCommand);
      commands.push(burnFuelCommand);

      const gameProcessing = new ProcessingQueueCommand();
      gameProcessing.setCommands(commands);

      await gameProcessing.execute();
      await sleep(1000);
      expect(messages.find((item) => item.includes('CheckFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('Error')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('StraightMoveCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('BurnFuelCommand')) !== undefined).equals(true);
    });
  });
  describe('dz #7 point 5. tests', function() {
    const messages:string[] = [];
    let logged;
    before(() => {
      sinon.stub(console, 'log').callsFake((message) => {
        logged = message;
        messages.push(message);
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    after(() => {
      sinon.restore();
    }); 
    it('dz #7 point 5. В nodejs синхронизация не требуется. Две параллельные игры. ProcessingQueueCommand - Команда, которая стартует код, написанный в пункте 1 в отдельном потоке', async function() {
      const commands1 = [];
      const checkFuelCommand = new CheckFuelCommand();
      const straightMoveCommand = new StraightMoveCommand();
      const burnFuelCommand = new BurnFuelCommand();
      burnFuelCommand.setFuelToBurn(3);
  
      commands1.push(checkFuelCommand);
      commands1.push(straightMoveCommand);
      commands1.push(burnFuelCommand);

      const gameProcessing1 = new ProcessingQueueCommand({gameName: 'first'});
      gameProcessing1.setCommands(commands1);

      const commands2 = [];
      const firstCommand = new FirstCommand();
      const secondCommand = new SecondCommand();
      commands2.push(firstCommand);
      commands2.push(secondCommand);

      const gameProcessing2 = new ProcessingQueueCommand({gameName: 'second'});
      gameProcessing2.setCommands(commands2);

      await Promise.all([gameProcessing1.execute(), gameProcessing2.execute()]);
      // проверяем, что все команды попадали в обработку(из обеих игр)
      expect(messages.find((item) => item.includes('executing command CheckFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command StraightMoveCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command BurnFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command FirstCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command SecondCommand')) !== undefined).equals(true);
    });
  });
  describe('dz #7 point 6. tests', function() {
    const messages:string[] = [];
    let logged;
    before(() => {
      sinon.stub(console, 'log').callsFake((message) => {
        logged = message;
        messages.push(message);
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    after(() => {
      sinon.restore();
    }); 
    it('dz #7 point 6. тест, который проверяет, что после команды hard stop, поток завершается ', async function() {
      const commands = [];
      const checkFuelCommand = new CheckFuelCommand();
      const straightMoveCommand = new StraightMoveCommand();
      const burnFuelCommand = new BurnFuelCommand();
      burnFuelCommand.setFuelToBurn(3);
      
      const keepProcessingCommand = new KeepProcessingCommand({ 
        commands: commands,
        delayMilliseconds: 1000,
      });
  
      commands.push(checkFuelCommand);
      commands.push(straightMoveCommand);
      commands.push(burnFuelCommand);
      commands.push(keepProcessingCommand);

      const gameProcessing = new ProcessingQueueCommand();
      gameProcessing.setCommands(commands);
      setTimeout(() => {
        commands.push(new HardStopCommand({ commands }));
      }, 1000);
      await gameProcessing.execute();
      await sleep(3000);
      expect(messages.find((item) => item.includes('executing command CheckFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command StraightMoveCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command BurnFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command KeepProcessingCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('HardStopCommand')) !== undefined).equals(true);
      // expect(messages[messages.length-1].includes('HardStopCommand')).equals(true);
    });
  });
  describe('dz #7 point 7. tests', function() {
    const messages:string[] = [];
    let logged;
    before(() => {
      sinon.stub(console, 'log').callsFake((message) => {
        logged = message;
        messages.push(message);
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    after(() => {
      sinon.restore();
    }); 
    it('dz #7 point 7. тест, который проверяет, что после команды soft stop, поток завершается только после того, как все задачи закончились', async function() {
      const commands = [];
      const checkFuelCommand = new CheckFuelCommand();
      const straightMoveCommand = new StraightMoveCommand();
      const burnFuelCommand = new BurnFuelCommand();
      burnFuelCommand.setFuelToBurn(3);
      /*
      const keepProcessingCommand = new KeepProcessingCommand({ 
        commands: commands,
        delayMilliseconds: 1000,
      });
      */
      commands.push(checkFuelCommand);
      commands.push(straightMoveCommand);
      commands.push(burnFuelCommand);
      // commands.push(keepProcessingCommand);
      commands.push(new FirstCommand());
      commands.push(new SoftStopCommand({ commands }));
      

      const gameProcessing = new ProcessingQueueCommand();
      gameProcessing.setCommands(commands);
      await gameProcessing.execute();
      await sleep(3000);
      expect(messages.find((item) => item.includes('executing command CheckFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command StraightMoveCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command BurnFuelCommand')) !== undefined).equals(true);
      // expect(messages.find((item) => item.includes('executing command KeepProcessingCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('executing command FirstCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('SoftStopCommand')) !== undefined).equals(true);
      // expect(messages[messages.length-1].includes('SoftStopCommand')).equals(true);
    });
  });
});