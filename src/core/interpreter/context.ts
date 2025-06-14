

export class Context{
  private variables: Map<string, any>;
  constructor(){
    this.variables = new Map();
  }
  setVariable(
    name: string,
    value: any
  ){
    this.variables.set(name, value);
  }
  getVariable(name: string){
    return this.variables.get(name);
  }
}