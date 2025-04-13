import { Body, Controller, Get, HttpCode, HttpStatus, Injectable, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { Authentication } from '../../../contracts/authentication';
import { AuthService } from '../auth/auth.service';
import { GameService } from '../game/game.service';
import { Authorization } from '../../../contracts/authorization';

@Injectable()
export class AppUsecases {
	constructor(
    private readonly gameService: GameService,
    private readonly authService: AuthService,
  ) {}

	async login(dto: Authentication.LoginRequest): Promise<Authentication.LoginResponse> {
    const response = new Authentication.LoginResponse();
    const validated = await this.authService.authenticate(dto.login, dto.password);
    if(validated) {
      // generate jwt token, refresh token
      response.success = true;
      // const gameId = await this.gameService.getGameIdByLogin(dto.login);
      // const payload = { id: dto.login, gameId };
      const payload = { id: dto.login };
      response.token = await this.authService.generateAccessToken(payload);
      response.refreshToken = await this.authService.generateRefreshToken(payload);;
    } else {
      response.success = false;
    }
    return Promise.resolve(response);
    }
  async authorize(dto: Authorization.AuthorizeInGameRequest): Promise<Authorization.AuthorizeInGameResponse> {
    const response = new Authorization.AuthorizeInGameResponse();
    // .,,
    return Promise.resolve(response);
  }
}
