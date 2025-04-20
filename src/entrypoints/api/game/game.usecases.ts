import { Injectable } from '@nestjs/common';
import { InterpretCommand } from '../../../core/interpret-command';
import { IoC } from '../../../core/ioc/ioc';
import { Authentication } from '../../../contracts/authentication';
import { AuthHelper } from '../../../core/auth/auth-helper';
import httpContext from 'express-http-context';
import { AuthService } from '../auth/auth.service';

const USER_HTTP_CONTEXT = 'user';

@Injectable()
export class GameUsecases {

  constructor(
      private readonly authService: AuthService,
  
    ) {}

  async authorizeInGame(gameId: string): Promise<any> {
    
    const userId = httpContext.get(USER_HTTP_CONTEXT);
    console.log(`Getting httpContext ${USER_HTTP_CONTEXT} userId:'${userId}'`);

    IoC.setCurrenScope(gameId);
    const logins = IoC.getUserLogins(gameId);
    const authorized = logins.find((item) => { item === userId});
    const result: any = {};
    if(authorized) {
      throw new Error(`Пользователь ${userId} не авторизован для игры ${gameId}`);
    }
    const payload = {
      id: userId,
      gameId
    };
    
    result.token = await this.authService.generateAccessToken(payload);

    return Promise.resolve(result);
  }
}

