import { expect, assert } from 'chai';
import sinon from 'sinon';
import { IoC } from '../src/core/ioc/ioc';

import { InitCommand } from '../src/core/scopes/init-command';
import { ProcessingQueueCommand } from '../src/core/threads/processing-queue-command';
import { HardStopCommand } from '../src/core/hard-stop-command';
import { ICommand } from '../src/core/interfaces/icommand';
import { KeepProcessingCommand } from '../src/core/keep-processing-command';
import { FindObjectCommand } from '../src/core/find-object-command';
import { AreaSystemFactory } from '../src/core/collisions/area-system-factory';
import { Area } from '../src/core/collisions/area';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

describe('AreaSystemFactory tests', function() {
  describe('dz #12 AreaSystemFactory tests', function() {
    const testGameName = 'gameName1234';
    let messages:string[] = [];
    let gameProcessing;
    before(async () => {
      
    });
    after(async () => {
     
    });
    it('AreaSystemFactory test', async function() {

      const options = {
        minX: 0,
        maxX: 100,
        minY: 0,
        maxY: 100,
        stepX: 10,
        initialShiftX: 0,
        stepY: 10,
        initialShiftY: 0,
      };

      const areaSystem = AreaSystemFactory.createAreaSystem(options);
      

      expect(areaSystem.getSize()).equals(100);
      expect(areaSystem.getAreas().find(area => area.getMinX() === 0 && area.getMaxX() === 10 && area.getMinY() === 0 && area.getMaxY() === 10)).not.equals(undefined);
      expect(areaSystem.getAreas().find(area => area.getMinX() === 0 && area.getMaxX() === 10 && area.getMinY() === 90 && area.getMaxY() === 100)).not.equals(undefined);
      expect(areaSystem.getAreas().find(area => area.getMinX() === 90 && area.getMaxX() === 100 && area.getMinY() === 0 && area.getMaxY() === 10)).not.equals(undefined);
      expect(areaSystem.getAreas().find(area => area.getMinX() === 90 && area.getMaxX() === 100 && area.getMinY() === 90 && area.getMaxY() === 100)).not.equals(undefined);
    });

    it('AreaSystemFactory test', async function() {
      const stepX = 10;
      const stepY = 10;
      const initialShiftX = stepX/2;
      const initialShiftY = stepY/2;

      const options = {
        minX: 0,
        maxX: 100,
        minY: 0,
        maxY: 100,
        stepX,
        initialShiftX,
        stepY,
        initialShiftY,
      };

      const areaSystem = AreaSystemFactory.createAreaSystem(options);

      expect(areaSystem.getSize()).equals(121);
      expect(areaSystem.getAreas().find(area => area.getMinX() === 0 && area.getMaxX() === 5 && area.getMinY() === 0 && area.getMaxY() === 5)).not.equals(undefined);
      expect(areaSystem.getAreas().find(area => area.getMinX() === 5 && area.getMaxX() === 15 && area.getMinY() === 0 && area.getMaxY() === 5)).not.equals(undefined);
      expect(areaSystem.getAreas().find(area => area.getMinX() === 0 && area.getMaxX() === 5 && area.getMinY() === 5 && area.getMaxY() === 15)).not.equals(undefined);
      expect(areaSystem.getAreas().find(area => area.getMinX() === 5 && area.getMaxX() === 15 && area.getMinY() === 5 && area.getMaxY() === 15)).not.equals(undefined);
      expect(areaSystem.getAreas().find(area => area.getMinX() === 95 && area.getMaxX() === 100 && area.getMinY() === 95 && area.getMaxY() === 100)).not.equals(undefined);
    });


  });
});
