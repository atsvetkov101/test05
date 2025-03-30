import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { ICommand } from './interfaces/icommand';

export class FlexibleCommand implements ICommand{
  args;
  loggerService;
  target;
  constructor(args: any){
    this.args = args[0];
    this.loggerService = new LoggerService();
  }
  execute(): Promise<void> {
    console.log(`executing FlexibleCommand.execute() target:${JSON.stringify(this.target)}`);
    // do nothing;
    return Promise.resolve();
  }
  getType(): string {
    return 'FlexibleCommand';
  }

  getArgs(){
    return this.args;
  }

  setTarget?( arg: object ): void{
    this.target = arg;
  }
}
