import { Injectable } from '@nestjs/common';
import { InterpretCommand } from '../../../core/interpret-command';
import { IoC } from '../../../core/ioc/ioc';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}

  async interpretCommand(data): Promise<any>  {

    IoC.setCurrenScope(data.idGame);
    
    const interpretCommand = new InterpretCommand({
      idGame: data.idGame,
      idObject: data.idObject,
      idCommand: data.idCommand,
      commandArgs: data.args,
    });
    let success = false;
    try {
      await interpretCommand.execute();
      success = true;
    }catch(e: any){
      console.log(`interpretCommand Error:${e.message}`);
    }
    return {
      success
    };
  }
}
