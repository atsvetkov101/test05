import * as ts from 'typescript';

export class TsCompiler{
  public static compileCode = (sourceCode: string): string => {
    const result = ts.transpileModule(sourceCode, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    });
    return result.outputText;
  };
  public static runCode = (code: string) => {
    const module = { exports: {} };
    const require = (name: string) => {
      if (name === 'typescript') return ts;
      throw new Error(`Module ${name} not found`);
    };
    const exports = module.exports;
    eval(code);
    return module.exports;
  };
}