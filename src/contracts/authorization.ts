import { Type } from 'class-transformer';
import {
  IsString,
} from 'class-validator';

export namespace Authorization {
  export class AuthorizeInGameRequest {
    @IsString()
			login!: string;

		@IsString()
			password!: string;

    @IsString()
      idGame!: string;
  }

  export class AuthorizeInGameResponse {
    success!: boolean;
		token!: string;
		refreshToken!: string;
	}

}
