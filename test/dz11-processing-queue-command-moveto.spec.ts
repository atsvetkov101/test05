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
import { MoveToCommand } from '../src/core/moveto-command';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

describe('ProcessingQueueCommand tests 2', function() {
  describe('dz #11 moveto tests', function() {
    const messages:string[] = [];
    let logged;
    let gameProcessing;
    let anotherGameProcessing;
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
      if(anotherGameProcessing) {
        anotherGameProcessing.dispose();
      }
      sinon.restore();
    }); 
    it('dz #11 point 6. Тест, который проверяет, что после команды MoveToCommand, поток переходит на обработку Команд с помощью состояния MoveTo', async function() {
      const commands = [];
      gameProcessing = new ProcessingQueueStateCommand();
      gameProcessing.setCommands(commands);

      // Создаем отдельную игру, чтобы в нее копировать ...
      const anotherGameCommands = [];
      const anotherGameName = 'anotherGame';
      const anotherGameProcessing = new ProcessingQueueStateCommand({
        gameName: anotherGameName
      });
      anotherGameProcessing.setCommands(anotherGameCommands);
      
      gameProcessing.setTargetGameName(anotherGameName);

      const checkFuelCommand = new CheckFuelCommand();
      const movetoCommand = new MoveToCommand({ gameProcessing });
      const straightMoveCommand = new StraightMoveCommand();
      const burnFuelCommand = new BurnFuelCommand();
      burnFuelCommand.setFuelToBurn(3);
      
      commands.push(checkFuelCommand);
      commands.push(movetoCommand);
      commands.push(straightMoveCommand);
      commands.push(burnFuelCommand);
      
      commands.push(new FirstCommand());
      commands.push(new SoftStopCommand({ commands }));
  
      await gameProcessing.execute();
      await sleep(1000);
      expect(messages.find((item) => item.includes('command executed CheckFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('command executed MoveToCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('command moved StraightMoveCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('command moved BurnFuelCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('command moved FirstCommand')) !== undefined).equals(true);
      expect(messages.find((item) => item.includes('command moved SoftStopCommand')) !== undefined).equals(true);
    });
  });
  
});