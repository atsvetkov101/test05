import { Injectable } from '@nestjs/common';
import { InterpretCommand } from '../../../core/interpret-command';
import { IoC } from '../../../core/ioc/ioc';
import { Authentication } from '../../../contracts/authentication';
import { AuthHelper } from '../../../core/auth/auth-helper';
import { JwtService } from '@nestjs/jwt';

const ACCESS_TOKEN_EXPIRE_SECONDS = 300; // 5 мин
const REFRESH_TOKEN_EXPIRE_SECONDS = 60*60*24; // 1 день

@Injectable()
export class AuthService {

  constructor(
		private readonly jwtService: JwtService,
	) {}
  public async generateAccessToken(payload: any) {
    return this.jwtService.signAsync(payload, {
			expiresIn: ACCESS_TOKEN_EXPIRE_SECONDS
		});
  }
  public async generateRefreshToken(payload: any) {
    return this.jwtService.signAsync(payload, {
			expiresIn: REFRESH_TOKEN_EXPIRE_SECONDS
		});
  }
  public async authenticate(login: string, password: string) {
    return AuthHelper.login(login, password);
  }
  /*
  async login(dto: Authentication.LoginRequest): Promise<Authentication.LoginResponse> {
    const response = new Authentication.LoginResponse();
    const validated = await this.authenticate(dto.login, dto.password);
    if(validated) {
      // generate jwt token, refresh token
      response.success = true;
      const payload = { id: dto.login };
      response.token = await this.generateAccessToken(payload);
      response.refreshToken = await this.generateRefreshToken(payload);;
    } else {
      response.success = false;
    }
    return Promise.resolve(response);
  }
    */
}

