import { expect } from 'chai';
import { IoC } from '../src/core/ioc/ioc';
import { InitCommand } from '../src/core/scopes/init-command';
import { FirstCommand } from './first-command';
import { SecondCommand } from './second-command';
import { ClearCurrentScopeCommand } from '../src/core/scopes/clear-current-scope-command';

const timeout = 50;
const setAndCheckScopeFunc = async (scope) => {
  return new Promise(async (resolve, reject) => {
    await IoC.Resolve('IoC.Scope.Current.Set', scope).execute();
    let counter = 0;
    const funcId = Math.round(Math.random() * 100000);
    const myTimer = setInterval(() => {
      const currentScope = IoC.Resolve('IoC.Scope.Current');
      // console.log(`func${funcId} iteration:${counter} currentScope:${currentScope}`);
      counter++;
      if(counter > 5){
        clearInterval(myTimer);
        resolve(currentScope);
      }
    },
    timeout);
  });
};

const resolveSomeCommandFunc = async (scope, expectedType) => {
  return new Promise(async (resolve, reject) => {
    await IoC.Resolve('IoC.Scope.Current.Set', scope).execute();
    let counter = 0;
    const funcId = Math.round(Math.random() * 100000);
    let someCommand;
    const currentScope = IoC.Resolve('IoC.Scope.Current');
    const types = [];
    const myTimer = setInterval(() => {
      someCommand = IoC.Resolve('SomeCommand');
      const type = someCommand.getType();
      types.push(type);
      // eslint-disable-next-line max-len
      // console.log(`func${funcId} iteration:${counter} currentScope:${currentScope} someCommand_Type:${someCommand.getType()}`);
      counter++;
      if(counter > 5){
        clearInterval(myTimer);
        const unexpectedType = types.filter((type) => type !== expectedType);
        resolve(unexpectedType.length > 0 ? null : types[0]);
      }
    },
    timeout);
  });
};

const setScopeResolveSomeCommandFunc = async (scope, expectedType) => {
  return new Promise(async (resolve, reject) => {
    await IoC.Resolve('IoC.Scope.Current.Set', scope).execute();
    let counter = 0;
    const funcId = Math.round(Math.random() * 100000);
    let someCommand;
    const types = [];
    const myTimer = setInterval(async () => {
      await IoC.Resolve('IoC.Scope.Current.Set', scope).execute();
      const currentScope = IoC.Resolve('IoC.Scope.Current');
      someCommand = IoC.Resolve('SomeCommand');
      const type = someCommand.getType();
      types.push(type);
      // eslint-disable-next-line max-len
      // console.log(`func${funcId} iteration:${counter} currentScope:${currentScope} someCommand_Type:${someCommand.getType()}`);
      counter++;
      if(counter > 5){
        clearInterval(myTimer);
        const unexpectedType = types.filter((type) => type !== expectedType);
        resolve(unexpectedType.length > 0 ? null : types[0]);
      }
    },
    timeout);
  });
};


describe('Тесты для многопоточности для IoC', function() {
  describe('Набор тестов для многопоточности для IoC', function() {
    before(async () => {
      await (new InitCommand()).execute();
    });
    after(async () => {
      await (new ClearCurrentScopeCommand()).execute();
    });
    it('Одна функция проверяем скоуп. default скоуп', async function() {

      const func1 = new Promise((resolve, reject) => {
        let counter = 0;
        const myTimer = setInterval(() => {
          const currentScope = IoC.Resolve('IoC.Scope.Current');
          // console.log(`func1 iteration:${counter} currentScope:${currentScope}`);
          counter++;
          if(counter > 5){
            clearInterval(myTimer);
            resolve(currentScope);
          }
        },
        timeout);
      });
      
      const res = await Promise.all([func1]);
      expect(res[0]).equals('default');
    });

    it('Одна функция проверяем скоуп. mytestscope скоуп', async function() {
      const res = await Promise.all([setAndCheckScopeFunc('mytestscope')]);
      expect(res[0]).equals('mytestscope');
    });

    it('IoC. скоупы mytestscope1 и mytestscope2', async function() {
      const res = await Promise.all([setAndCheckScopeFunc('mytestscope1'), setAndCheckScopeFunc('mytestscope2')]);
      expect(res[0]).equals('mytestscope1');
      expect(res[1]).equals('mytestscope2');
    });

    it('IoC. регистрируем в разных скоупах разные имтлементации и разрешаем', async function() {

      const scope1 = 'scope101';
      const scope2 = 'scope102';
      await IoC.Resolve('IoC.Scope.Current.Set', scope1).execute();
      await IoC.Resolve('IoC.Register', 'SomeCommand',(...args) => {
        return new FirstCommand(args);
      }).execute();

      await IoC.Resolve('IoC.Scope.Current.Set', scope2).execute();
      await IoC.Resolve('IoC.Register', 'SomeCommand',(...args) => {
        return new SecondCommand(args);
      }).execute();

      const res = await Promise.all([
        resolveSomeCommandFunc(scope1, 'FirstCommand'), 
        resolveSomeCommandFunc(scope2, 'SecondCommand')
      ]);


      const firstCommandType = res[0];
      const secondCommandType = res[1];

      expect(firstCommandType).equals('FirstCommand');
      expect(secondCommandType).equals('SecondCommand');
    });

    // eslint-disable-next-line max-len
    it('IoC. регистрируем в разных скоупах разные имтлементации. Переключаем скоупы перед каждым разрешением зависимости', async function() {

      const scope1 = 'scope103';
      const scope2 = 'scope104';
      await IoC.Resolve('IoC.Scope.Current.Set', scope1).execute();
      await IoC.Resolve('IoC.Register', 'SomeCommand',(...args) => {
        return new FirstCommand(args);
      }).execute();

      await IoC.Resolve('IoC.Scope.Current.Set', scope2).execute();
      await IoC.Resolve('IoC.Register', 'SomeCommand',(...args) => {
        return new SecondCommand(args);
      }).execute();

      const res = await Promise.all([
        setScopeResolveSomeCommandFunc(scope1, 'FirstCommand'), 
        setScopeResolveSomeCommandFunc(scope2, 'SecondCommand')
      ]);

      const firstCommandType = res[0];
      const secondCommandType = res[1];

      expect(firstCommandType).equals('FirstCommand');
      expect(secondCommandType).equals('SecondCommand');
    });
  });
});