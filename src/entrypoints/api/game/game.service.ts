import { Injectable } from '@nestjs/common';
import { InterpretCommand } from '../../../core/interpret-command';
import { IoC } from '../../../core/ioc/ioc';
import { Authentication } from '../../../contracts/authentication';
import { AuthHelper } from '../../../core/auth/auth-helper';

@Injectable()
export class GameService {

  async getGameIdByLogin(login: string): Promise<string> {
    const gameId = 'my_test_game';
    // TODO: implement game resolution by login
    // ...
    return Promise.resolve(gameId);
  }
}

