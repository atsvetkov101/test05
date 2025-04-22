import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
} from 'class-validator';

export namespace Game {
  export class StartGameRequest {
    @IsArray()
  	userLogins!: string[];

  }

  export class StartGameResponse {
    success!: boolean;

    gameId!: string;
    error: any;
    errorCode: any;
	}

  export class AuthorizeInGameRequest {
    @IsString()
    gameId!: string;
  }

  export class AuthorizeInGameResponse {
    success!: boolean;

    token!: string;
    errorCode: any;
    error: any;
	}
}
