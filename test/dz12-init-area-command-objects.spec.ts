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

describe('InitAreaCommand objects tests', function() {
  describe('dz #12 InitAreaCommand objects tests', function() {
    before(async () => {
      
    });
    after(async () => {
     
    });
    it('InitAreaCommand objects test', async function() {

      const initAreaCommand = new InitAreaCommand();
      initAreaCommand.execute();
      const objects = initAreaCommand.getObjects();

      const areaObjectsSystem1 = initAreaCommand.getAreaObjectsSystem1();
      const areaObjectsSystem2 = initAreaCommand.getAreaObjectsSystem2();

      const numberOfObjects = 100;
      expect(objects.length).to.be.equal(numberOfObjects);
      // считаем количество объектов в каждой зоне в системе 1
      const System1ObjectsLength = areaObjectsSystem1.AllAreaObjects.reduce((acc,item) => {if (item){return acc+item.length} else {return acc;}}, 0);
      // считаем количество объектов в каждой зоне в системе 2
      const System2ObjectsLength = areaObjectsSystem2.AllAreaObjects.reduce((acc,item) => {if (item){return acc+item.length} else {return acc;}}, 0);
      expect(System1ObjectsLength).to.be.equal(numberOfObjects);
      expect(System2ObjectsLength).to.be.equal(numberOfObjects);


    });
  });
});
