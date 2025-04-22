import { Type } from 'class-transformer';
import {
  IsString,
} from 'class-validator';

export namespace Authorization {
  export class AuthorizeInGameRequest {
     @IsString()
      idGame!: string;
  }

  export class AuthorizeInGameResponse {
    success!: boolean;
		token!: string;
		refreshToken!: string;
	}

}
