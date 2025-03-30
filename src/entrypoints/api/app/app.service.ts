import { Injectable } from '@nestjs/common';
import { InterpretCommand } from '../../../core/interpret-command';
import { IoC } from '../../../core/ioc/ioc';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}

  async interpretCommand(data): Promise<null>  {

    IoC.setCurrenScope('default');
    
    const interpretCommand = new InterpretCommand({
      idGame: data.idGame,
      idObject: data.idObject,
      idCommand: data.idCommand,
      commandArgs: data.args,
    });

    await interpretCommand.execute();

    return null;
  }
}
