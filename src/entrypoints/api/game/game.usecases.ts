import { Injectable } from '@nestjs/common';
import { InterpretCommand } from '../../../core/interpret-command';
import { IoC } from '../../../core/ioc/ioc';
import { Authentication } from '../../../contracts/authentication';
import { AuthHelper } from '../../../core/auth/auth-helper';
import httpContext from 'express-http-context';

@Injectable()
export class GameUsecases {

  async authorizeInGame(gameId: string): Promise<string> {

    const user = httpContext.get('user');
    // TODO: implement game resolution by login
    // ...
    return Promise.resolve(gameId);
  }
}

