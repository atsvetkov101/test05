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
import { InitAreaCommand } from '../src/core/collisions/init-area-command';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

describe('InitAreaCommand tests', function() {
  describe('dz #12 InitAreaCommand tests', function() {
    before(async () => {
      
    });
    after(async () => {
     
    });
    it('InitAreaCommand AreaSystem1 AreaSystem2 test', async function() {

      const initAreaCommand = new InitAreaCommand();
      initAreaCommand.execute();
      const areaSystem1 = initAreaCommand.getAreaSystem1();

      expect(areaSystem1.getSize()).equals(100);
      expect(areaSystem1.getAreas().find(area => area.getMinX() === 0 && area.getMaxX() === 10 && area.getMinY() === 0 && area.getMaxY() === 10)).not.equals(undefined);
      expect(areaSystem1.getAreas().find(area => area.getMinX() === 0 && area.getMaxX() === 10 && area.getMinY() === 90 && area.getMaxY() === 100)).not.equals(undefined);
      expect(areaSystem1.getAreas().find(area => area.getMinX() === 90 && area.getMaxX() === 100 && area.getMinY() === 0 && area.getMaxY() === 10)).not.equals(undefined);
      expect(areaSystem1.getAreas().find(area => area.getMinX() === 90 && area.getMaxX() === 100 && area.getMinY() === 90 && area.getMaxY() === 100)).not.equals(undefined);

      const areaSystem2 = initAreaCommand.getAreaSystem2();

      expect(areaSystem2.getSize()).equals(121);
      expect(areaSystem2.getAreas().find(area => area.getMinX() === 0 && area.getMaxX() === 5 && area.getMinY() === 0 && area.getMaxY() === 5)).not.equals(undefined);
      expect(areaSystem2.getAreas().find(area => area.getMinX() === 5 && area.getMaxX() === 15 && area.getMinY() === 0 && area.getMaxY() === 5)).not.equals(undefined);
      expect(areaSystem2.getAreas().find(area => area.getMinX() === 0 && area.getMaxX() === 5 && area.getMinY() === 5 && area.getMaxY() === 15)).not.equals(undefined);
      expect(areaSystem2.getAreas().find(area => area.getMinX() === 5 && area.getMaxX() === 15 && area.getMinY() === 5 && area.getMaxY() === 15)).not.equals(undefined);
      expect(areaSystem2.getAreas().find(area => area.getMinX() === 95 && area.getMaxX() === 100 && area.getMinY() === 95 && area.getMaxY() === 100)).not.equals(undefined);

    });
  });
});
