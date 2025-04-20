import { Injectable } from '@nestjs/common';
import httpContext from 'express-http-context';

import { InterpretCommand } from '../../../core/interpret-command';
import { IoC } from '../../../core/ioc/ioc';

const AVAILABLE_GAME = 'game';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}

  async interpretCommand(data): Promise<any>  {
    const availableGameId = httpContext.get(AVAILABLE_GAME);
    if(availableGameId !== data.idGame) {
      return {
        success: false,
        error: `Пользователь не может вызывать команды для данной игры ${data.idGame}`
      };
    }
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
