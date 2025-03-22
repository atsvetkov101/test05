
import { expect } from 'chai';
import { TsCompiler } from '../src/core/compiler';
import sinon from 'sinon';

describe('compiler test module', function() {
  describe('compiler tests', function() {
    it('compiling simple code', function() {
      const classCode = `
class DynamicClass {
    constructor(public name: string) {}
    
    #val: number;

    public greet() {
        return "Hello, " + this.name;
    }
}
`;
      const jsCode = TsCompiler.compileCode(classCode);
      // console.log('Скомпилированный JavaScript код:\n', jsCode);

      expect(jsCode).not.to.be.null;
      expect(jsCode).not.to.be.undefined;
    });

    it('running simple code', function() {
      const classCode = `
export class DynamicClass {
    constructor(public name: string) {}
    
    #val: number;

    public greet() {
        return "Hello, " + this.name;
    }
}
`;
      const jsCode = TsCompiler.compileCode(classCode);
      // console.log('Скомпилированный JavaScript код:\n', jsCode);

      const result:any = TsCompiler.runCode(jsCode);
      expect(result).not.to.be.null;
      expect(result).not.to.be.undefined;
      expect(result).to.have.own.property('DynamicClass');
      const DynamicClass = result.DynamicClass;
      expect(DynamicClass).to.be.an.instanceof(Object);
    });
  });
  describe('compiler tests 2', function() {
    let logged;
    before(() => {
      sinon.stub(console, 'log').callsFake((message) => {
        logged = message;
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    after(() => {
      sinon.restore();
    });        
    it('creating instance of dynamic class', function() {
      const classCode = `
export class DynamicClass {
    constructor(public name: string) {}
    
    #val: number;

    public greet() {
        return "Hello, " + this.name;
    }
}
`;
      const jsCode = TsCompiler.compileCode(classCode);
      const result:any = TsCompiler.runCode(jsCode);
      
      const DynamicClass = result.DynamicClass;
      expect(DynamicClass).to.be.an.instanceof(Object);

      const instance = new DynamicClass('Bob');
      console.log(instance.greet());
      expect(logged).to.equal('Hello, Bob');
    });
  });
});
