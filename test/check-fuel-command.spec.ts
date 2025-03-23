import { expect, assert } from 'chai';

import { GameObject } from '../src/core/game-object';
import { CheckFuelCommand } from '../src/core/check-fuel-command';
import { Point } from '../src/core/point';
import { Vector } from '../src/core/vector';
import { CommandException } from '../src/core/command-exception';

describe('CheckFuelCommand tests', function() {
  describe('CheckFuelCommand test set', function() {
    // eslint-disable-next-line max-len
    it('point 3. CheckFuelCommand: у объекта есть топливо для движения', async function() {
      const obj:GameObject = new GameObject({ 
        position: null, 
        velocity: null, 
        fuel: 10
      });
      const checkFuelCommand = new CheckFuelCommand();
      checkFuelCommand.setTarget(obj);
      let err;
      try{
        await checkFuelCommand.execute();
      } catch(e) {
        err = e;
      }

      expect(err).equals(undefined);
    });

    it('point 3.CheckFuelCommand: у объекта нет топлива для движения', async function() {
      const obj:GameObject = new GameObject({ 
        position: new Point(12, 5), 
        velocity: new Vector(-7, 3), 
        fuel: 0
      });
      const checkFuelCommand = new CheckFuelCommand();
      checkFuelCommand.setTarget(obj);
      let err;
      try{
        await checkFuelCommand.execute();
      } catch(e) {
        err = e;
      }
      expect(err instanceof CommandException).equals(true);
    });

  });
});