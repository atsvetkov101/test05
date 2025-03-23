import { expect, assert } from 'chai';
import { IoC } from '../src/core/ioc/ioc';
import { StraightMoveCommand } from '../src/core/straight-move-command';
import { Point } from '../src/core/point';
import { ManyArgumentsCommand } from '../src/core/many-arguments-command';
import { Vector } from '../src/core/vector';
import { InitCommand } from '../src/core/scopes/init-command';
import { ICommand } from '../src/core/interfaces/icommand';
import { ClearCurrentScopeCommand } from '../src/core/scopes/clear-current-scope-command';

describe('Тесты для init-command', function() {
  describe('Набор тестов для init-command', function() {
    it('IoC без инициализации', function() {
      let straightMoveCommand;
      let caughtError;
      try{
        straightMoveCommand = IoC.Resolve<StraightMoveCommand>('StraightMoveCommand');
      } catch (e) {
        caughtError = e;
      }
      expect(caughtError, 'Ошибок не происходило. caughtError is undefined').to.be.undefined;
      expect(straightMoveCommand, 'Объект не бы разрешен. StraightMoveCommand is undefined').to.be.null;
    });
  });
  describe('Набор тестов для init-command #2', function() {
    before(async () => {
      await (new InitCommand()).execute();
    });
    after(async () => {
      await (new ClearCurrentScopeCommand()).execute();
    });
    it('IoC с инициализацией', function() {
      let straightMoveCommand;
      let caughtError;
      try{
        straightMoveCommand = IoC.Resolve<StraightMoveCommand>('StraightMoveCommand');
      } catch (e) {
        caughtError = e;
      }
      expect(caughtError, 'Ошибок не происходило. caughtError is undefined').to.be.undefined;
      expect(straightMoveCommand, 'Объект не бы разрешен. StraightMoveCommand is undefined').to.be.not.null;
      expect(straightMoveCommand, 'Объект не бы разрешен. StraightMoveCommand is undefined').to.be.not.undefined;
    });
    it('IoC скоуп по-умолчанию \'default\'', function() {
      const scope = IoC.Resolve<string>('IoC.Scope.Current');
      expect(scope, 'IoC скоуп по-умолчанию \'default\'').equals('default');
    });
    it('IoC устанавливаем скоуп', async function() {
      await IoC.Resolve('IoC.Scope.Current.Set', 'myscope').execute();
      const currentScope = IoC.Resolve<string>('IoC.Scope.Current');
      expect(currentScope).equals('myscope');
    });
    it('IoC устанавливаем скоуп. Регистрируем зависимость в скоупе. Проверяем, что разрешается.', async function() {
      await IoC.Resolve('IoC.Scope.Current.Set', 'myscope1').execute();
      await IoC.Resolve<ICommand>('IoC.Register', 'ManyArgumentsCommand', (...args) => {
        return new ManyArgumentsCommand(args);
      }).execute();

      const command = IoC.Resolve<ManyArgumentsCommand>('ManyArgumentsCommand', 
        new Point(10,10),
        new Vector(5,5)
      );
      expect(command, 'command ManyArgumentsCommand is undefined').not.to.be.undefined;
      expect(command, 'command ManyArgumentsCommand is null').not.to.be.null;
    });
    // eslint-disable-next-line max-len
    it('IoC устанавливаем скоуп. Регистрируем зависимость в скоупе. Проверяем, что не разрешается в другом скоупе.', async function() {
      await IoC.Resolve('IoC.Scope.Current.Set', 'scope1').execute();
      await IoC.Resolve<ICommand>('IoC.Register', 'ManyArgumentsCommand', (...args) => {
        return new ManyArgumentsCommand(args);
      }).execute();
      await IoC.Resolve('IoC.Scope.Current.Set', 'scope2').execute();
      const command = IoC.Resolve<ManyArgumentsCommand>('ManyArgumentsCommand', 
        new Point(10,10),
        new Vector(5,5)
      );
      expect(command, 'command ManyArgumentsCommand is null').to.be.null;
    });
  });
});