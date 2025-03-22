import { expect, assert } from 'chai';
import { IoC } from '../src/core/ioc/ioc';
import { ICommand } from '../src/core/interfaces/icommand';
import { AdapterGenerator } from '../src/core/adapter/adapter-generator';
import { Vector } from '../src/core/vector';
import { InitCommand } from '../src/core/scopes/init-command';
import { ClearCurrentScopeCommand } from '../src/core/scopes/clear-current-scope-command';


interface IMovable
{
  getPosition(): Vector;
  setPosition(newValue: Vector):void ;
  getVelocity(): Vector;
}

class Implementer implements IMovable {
  getPosition(): Vector {
    throw new Error('Method not implemented.');
  }
  setPosition(newValue: Vector): void {
    throw new Error('Method not implemented.');
  }
  getVelocity(): Vector {
    throw new Error('Method not implemented.');
  }
  
}

describe('Тесты для адаптера', function() {
  describe('Набор тестов для адаптера', function() {
    before(() => {
      new InitCommand().execute();
    });
    after(() => {
      new ClearCurrentScopeCommand().execute();
    });
    it.skip('DZ6 points 2,3,4 IoC регистрируем и используеи адаптер. Создаем экземпляр динамического класса.', function() {

      IoC.Resolve('IoC.Register', 'Adapter', (...args) => {
        return AdapterGenerator.generate(args);
      }).execute();

      const ClassAdapter = IoC.Resolve('Adapter', 'IMovable', Implementer);
      
      expect(ClassAdapter, 'adapter is null').to.not.be.null;

      const instance = new ClassAdapter();
      expect(instance instanceof ClassAdapter).equals(true);
      expect(ClassAdapter.prototype).to.have.own.property('getPosition');
      expect(ClassAdapter.prototype).to.have.own.property('setPosition');
      expect(ClassAdapter.prototype).to.have.own.property('getVelocity');

    });
  });
});

