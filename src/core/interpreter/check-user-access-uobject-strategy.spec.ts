import { CheckUserAccessUobjectStrategy } from './check-user-access-uobject-strategy';
import { IObjectStorage } from '../interfaces/iobject-storage';

describe('CheckUserAccessUObjectStrategy', () => {
  class MockObjectStorage implements IObjectStorage {
    getObjects(gameId: string): any[] {
      return this.objectsByGameId[gameId] || [];
    }

    objectsByGameId: { [key: string]: any[] } = {};
  }

  const mockObjectStorage = new MockObjectStorage();
  const strategy = new CheckUserAccessUobjectStrategy(
    'game123', 
    'object456', 
    'user789', 
    mockObjectStorage
  );

  it('should return true if executorUserId matches object ownerId', () => {
    mockObjectStorage.objectsByGameId['game123'] = [{
      id: 'object456',
      ownerId: 'user789'
    }];

    expect(strategy.execute()).toBe(true);
  });

  it('should return false if executorUserId does not match object ownerId', () => {
    mockObjectStorage.objectsByGameId['game123'] = [{
      id: 'object456',
      ownerId: 'user000'
    }];

    expect(strategy.execute()).toBe(false);
  });

  it('should return false if object does not exist', () => {
    mockObjectStorage.objectsByGameId['game123'] = [];
    expect(strategy.execute()).toBe(false);
  });

  it('should return false if object ownerId is not defined', () => {
    mockObjectStorage.objectsByGameId['game123'] = [{} as any];
    expect(strategy.execute()).toBe(false);
  });

  it('should return null if object ownerId is null', () => {
    mockObjectStorage.objectsByGameId['game123'] = [{
      id: 'object456',
      ownerId: null
    }];
    expect(strategy.getObjectOwnerId()).toBeNull();
  });

  it('should return undefined if object does not exist', () => {
    const accessStrategy = new CheckUserAccessUobjectStrategy(
      'game123',
      'objectNonExistent',
      'user789',
      mockObjectStorage
    );
    expect(accessStrategy.getObjectOwnerId()).toBeNull();
  });

  it('should return the ownerId from an existing object', () => {
    mockObjectStorage.objectsByGameId['game123'] = [{
      id: 'object456',
      ownerId: 'owner101'
    }];
    expect(strategy.getObjectOwnerId()).toBe('owner101');
  });
});
