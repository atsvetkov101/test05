import { Body, Controller, Get, HttpCode, HttpStatus, Injectable, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { Authentication } from '../../../contracts/authentication';
import { AuthService } from '../auth/auth.service';
import { Authorization } from '../../../contracts/authorization';
// import appEventProcessorInstance from '../../../core/runtime/app-event-processor-instance';
import { APP_EVENTS } from '../../../core/runtime/app-event-processor';
import { IoC } from '../../../core/ioc/ioc';
import { ExceptionHandler } from '../../../core/exception-handler';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

@Injectable()
export class AppUsecases {
	constructor(
    private readonly authService: AuthService,

  ) {
    /*
    appEventProcessorInstance.on(APP_EVENTS.START_GAME, async (data) => {
      IoC.setCurrenScope(data.currentGameName);
      const commands = data.processingQueueCommand.getCommands();
      const startTime = new Date().getTime();
      
      const elapsedMilliseconds =(): number => {
        const currentTime = new Date();
        return currentTime.getTime() - startTime;
      }
      while(true){
        if (commands.length == 0){
          await sleep(1000);
          continue;
        }
        const elapsed = elapsedMilliseconds();
        const command = commands.shift();
        try{
          console.log(`executing command ${command.getType()}  commands.length:${commands.length} `);
          await command.execute();
        } catch(e){
          console.log(`Error ${e}`);
          ExceptionHandler.handle(command, e);
        }
      }
    });
    */
  }

	async login(dto: Authentication.LoginRequest): Promise<Authentication.LoginResponse> {
    const response = new Authentication.LoginResponse();
    const validated = await this.authService.authenticate(dto.login, dto.password);
    if(validated) {
      // generate jwt token, refresh token
      response.success = true;
      // const gameId = await this.gameService.getGameIdByLogin(dto.login);
      // const payload = { id: dto.login, gameId };
      const payload = { id: dto.login };
      response.token = await this.authService.generateAccessToken(payload);
      response.refreshToken = await this.authService.generateRefreshToken(payload);;
    } else {
      response.success = false;
    }
    return Promise.resolve(response);
    }
  async authorize(dto: Authorization.AuthorizeInGameRequest): Promise<Authorization.AuthorizeInGameResponse> {
    const response = new Authorization.AuthorizeInGameResponse();

    // .,,
    return Promise.resolve(response);
  }
}
