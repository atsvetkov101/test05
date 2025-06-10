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

describe('InitAreaCommand objects getAssignedArea tests', function() {
  describe('dz #12 InitAreaCommand objects getAssignedArea tests', function() {
    before(async () => {
      
    });
    after(async () => {
     
    });
    it('InitAreaCommand objects getAssignedArea test', async function() {

      const initAreaCommand = new InitAreaCommand();
      initAreaCommand.execute();
      const objects = initAreaCommand.getObjects();

      const areaObjectsSystem1 = initAreaCommand.getAreaObjectsSystem1();
      const areaObjectsSystem2 = initAreaCommand.getAreaObjectsSystem2();

      const numberOfObjects = 100;
      expect(objects.length).to.be.equal(numberOfObjects);

      const object1 = objects[0];
      const area1 = areaObjectsSystem1.getAssignedArea(object1);
      expect(area1).to.be.not.equal(null);
      expect(object1.getLocation().x ).to.be.lessThan(area1.getMaxX());
      expect(object1.getLocation().x ).to.be.greaterThan(area1.getMinX());
      expect(object1.getLocation().y ).to.be.lessThan(area1.getMaxY());
      expect(object1.getLocation().y ).to.be.greaterThan(area1.getMinY());
      
    });
  });
});
