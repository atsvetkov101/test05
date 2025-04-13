import { Type } from 'class-transformer';
import {
  IsString,
} from 'class-validator';

export namespace Game {
  export class StartGameRequest {
    @IsString()
      gameId!: string;

			userLogins!: string[];

  }

  export class StartGameResponse {
    success!: boolean;
	}

}
