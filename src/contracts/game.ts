import { Type } from 'class-transformer';
import {
  IsString,
} from 'class-validator';

export namespace Game {
  export class StartGameRequest {
  	userLogins!: string[];

  }

  export class StartGameResponse {
    success!: boolean;

    gameId!: string;
	}

  export class AuthorizeInGameRequest {
    gameId!: string;
  }

  export class AuthorizeInGameResponse {
    success!: boolean;

    token!: string;
	}
}
