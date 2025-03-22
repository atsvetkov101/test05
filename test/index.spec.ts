// tslint:disable: only-arrow-functions
import { expect } from 'chai';
import { main } from '../src/core';

describe('Index module', function() {
  describe('expected behavior', function() {
    it('should return Выполнение завершено', function() {
      expect(main()).to.equal('Выполнение завершено');
    });
  });
});
