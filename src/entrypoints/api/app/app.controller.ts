import { Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';

import { AppService } from './app.service';
import { Authentication } from '../../../contracts/authentication';
import { AuthService } from '../auth/auth.service';
import { GameUsecases } from '../game/game.usecases';
import { AppUsecases } from './app.usecases';
import { GameProcessingUsecases } from '../game/game-processing.usecases';
import { Game } from '../../../contracts/game';
import { CustomHttpValidationPipe } from '../../../validation/custom-http-validation.pipe';

class InterpretCommandRequest{
  idGame: string; 
  idObject: string;
  idCommand:string;
  args: any;
}

@UsePipes(CustomHttpValidationPipe)
@Controller('api')
export class AppController {
	constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly appUsecases: AppUsecases,
    private readonly gameProcessingUsecases: GameProcessingUsecases, 
    private readonly gameUsecases: GameUsecases,
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
    const resp = new Game.StartGameResponse();
    try {
      resp.gameId = await this.gameProcessingUsecases.startNewGameByUser(dto.userLogins);
      resp.success = true;
    } catch (e: any) {
      resp.success = false;
      resp.error = e.message;
      resp.errorCode = e?.errorCode;
    }
    return Promise.resolve(resp);
  }

  @Post('/v1/authorize-in-game')
  @HttpCode(HttpStatus.OK)
  async authorizeInGame(@Body() dto: Game.AuthorizeInGameRequest): Promise<Game.AuthorizeInGameResponse> {
    let resp = new Game.AuthorizeInGameResponse();
    try {
      const result = await this.gameUsecases.authorizeInGame(dto.gameId);
      resp = {
        ...result,
        success: true,
      };
    } catch (e: any) {
      resp.success = false;
      resp.error = e.message;
      resp.errorCode = e?.errorCode;
    }
    return Promise.resolve(resp);
  }
}
