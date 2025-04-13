import { Type } from 'class-transformer';
import {
  IsString,
} from 'class-validator';



export namespace Authentication {
  export class LoginRequest {
    @IsString()
			login!: string;

		@IsString()
			password!: string;
  }

  export class LoginResponse {
    success!: boolean;
		token!: string;
		refreshToken!: string;
	}

}
