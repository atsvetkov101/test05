import { OrderExecutionCommand } from './order-execution-command';
import { BaseCommand } from '../base-command';
import { ApplicationRuntime } from '../application-runtime';
import { IObjectStorage } from '../interfaces/iobject-storage';


describe('OrderExecutionCommand', () => {
  let storage =   {
    "commands": [],
    "quant": 500,
    "disposed": false,
    "currentGameName": "rtt909807890",
    "getObjects": jest.fn()
  };

  beforeAll(() => {
    jest.spyOn(ApplicationRuntime, 'setObjectStorage').mockImplementation((storage: IObjectStorage) => {
      storage = storage;
    });
    jest.spyOn(ApplicationRuntime, 'getObjectStorage').mockImplementation(() => {
      return storage as IObjectStorage;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should correctly assign id, action and parameters properties', () => {
      const order = {
        uObjectid: '548',
        action: 'StartMove',
        initialVelocity: 2
      };

      const command = new OrderExecutionCommand(order);
      expect(command.getOrder()).toEqual(order);
      expect(command.getUObjectid()).toBe('548');
      expect(command.getAction()).toBe('StartMove');
      expect(command.getParameters()).toEqual({ initialVelocity: 2 });
    });
  });

  describe('getType', () => {
    it('should return the correct command type', () => {
      const command = new OrderExecutionCommand({});

      expect(command.getType()).toBe('OrderExecutionCommand');
    });
  });
});
