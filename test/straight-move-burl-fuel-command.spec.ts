import { expect, assert } from 'chai';

import { GameObject } from '../src/core/game-object';
import { CheckFuelCommand } from '../src/core/check-fuel-command';
import { Point } from '../src/core/point';
import { Vector } from '../src/core/vector';
import { CommandException } from '../src/core/command-exception';
import { BurnFuelCommand } from '../src/core/burn-fuel-command';
import { StraightMoveBurlFuelMacroCommand } from '../src/core/straight-move-burl-fuel-command';

describe('StraightMoveBurlFuelMacroCommand tests', function() {
  describe('StraightMoveBurlFuelMacroCommand test set', function() {
    // eslint-disable-next-line max-len
    it('point 7.StraightMoveBurlFuelMacroCommand: перемещаемся и сжигаем топливо, топливо есть', async function() {
      const obj:GameObject = new GameObject({ 
        position: new Point(12, 5), 
        velocity: new Vector(-7, 3), 
        fuel: 5
      });

      const macroCommand = new StraightMoveBurlFuelMacroCommand();
      macroCommand.setFuelToBurn(4);
      macroCommand.setTarget(obj);
      let err;
      try{
        await macroCommand.execute();
      } catch(e) {
        err = e;
      }

      expect(err).equals(undefined);
      expect(obj.getFuel()).equals(1);
    });

    it('point 7.StraightMoveBurlFuelMacroCommand: пытаемся перемещаться и сжигать топливо, но топлива нет', async function() {
      const obj:GameObject = new GameObject({ 
        position: new Point(12, 5), 
        velocity: new Vector(-7, 3), 
        fuel: 0
      });

      const macroCommand = new StraightMoveBurlFuelMacroCommand();
      macroCommand.setFuelToBurn(4);
      macroCommand.setTarget(obj);
      let err;
      try{
        await macroCommand.execute();
      } catch(e) {
        err = e;
      }

      expect(err instanceof CommandException).equals(true);
      // expect(function() { macroCommand.execute(); } ).to.throw(CommandException);
      expect(obj.getFuel()).equals(0);
    });

    // eslint-disable-next-line max-len
    it('point 7.StraightMoveBurlFuelMacroCommand: проверяем, что объект переместился, скорость не изменилась и топливо было израсходовано', async function() {
      const obj:GameObject = new GameObject({ 
        position: new Point(12, 5), 
        velocity: new Vector(-7, 3), 
        fuel: 7
      });

      const macroCommand = new StraightMoveBurlFuelMacroCommand();
      macroCommand.setFuelToBurn(4);
      macroCommand.setTarget(obj);
      let err;
      try{
        await macroCommand.execute();
      } catch(e) {
        err = e;
      }

      expect(err).equals(undefined);
      
      const location = obj.getLocation();
      expect(location.x).equals(5);
      expect(location.y).equals(8);

      const velocity = obj.getVelocity();
      expect(velocity.x).equals(-7);
      expect(velocity.y).equals(3);

      expect(obj.getFuel()).equals(3);
    });



  });
});