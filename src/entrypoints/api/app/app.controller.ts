import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { Authentication } from '../../../contracts/authentication';
import { AuthService } from '../auth/auth.service';
import { GameService } from '../game/game.service';
import { AppUsecases } from './app.usecases';
import { GameProcessingUsecases } from '../game/game-processing.usecases';
import { Game } from '../../../contracts/game';

class InterpretCommandRequest{
  idGame: string; 
  idObject: string;
  idCommand:string;
  args: any;
}

@Controller('api')
export class AppController {
	constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly appUsecases: AppUsecases,
    private readonly gameProcessingUsecases: GameProcessingUsecases
  ) {}

	@Get('/v1/hello-world')
	getHello(): string {
		return this.appService.getHello();
	}

  @Post('/v1/interpret-command')
  @HttpCode(HttpStatus.OK)
  interpretCommand(@Body() dto: any): Promise<null> {
    return this.appService.interpretCommand(dto);
  }

  @Post('/v1/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: Authentication.LoginRequest): Promise<Authentication.LoginResponse> {
    return this.appUsecases.login(dto);
    // return this.authService.login(dto);
  }

  @Post('/v1/start-game')
  @HttpCode(HttpStatus.OK)
  async startGame(@Body() dto: Game.StartGameRequest): Promise<Game.StartGameResponse> {
    return this.gameProcessingUsecases.startGameByUser(dto.gameId, dto.userLogins);
  }
}
