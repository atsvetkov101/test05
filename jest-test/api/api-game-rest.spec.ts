import supertest from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../../src/logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from '../../src/entrypoints/api/app/app.controller';
import { AppService } from '../../src/entrypoints/api/app/app.service';
import { AuthService } from '../../src/entrypoints/api/auth/auth.service';
import { AppUsecases } from '../../src/entrypoints/api/app/app.usecases';
import { GameUsecases } from '../../src/entrypoints/api/game/game.usecases';
import { GameProcessingUsecases } from '../../src/entrypoints/api/game/game-processing.usecases';
import { assert } from 'console';
import { Game } from '../../src/contracts/game';
import { INestApplication } from '@nestjs/common';
import { testHelper } from './test-helper';

const JWT_SECRET = 'JWT_SECRET';
const userLogin = {
  "login": "Alex",
  "password": "alex$secret_password"
}

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

describe('Game api ендпоинты', () => {
  let app: INestApplication;
    let appModule: TestingModule;
    beforeAll(async () => {
      appModule = await Test.createTestingModule({
        imports: [LoggerModule,
          JwtModule.register({
            global: true,
            secret: JWT_SECRET,
          }),
        ],
        controllers: [AppController],
        providers: [AppService, AuthService, AppUsecases, GameUsecases, GameProcessingUsecases],
      }).compile();
      app = appModule.createNestApplication();
      await app.init();
  });

  afterAll(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('Создание нового космического боя', function() {
    let gameId;
    it('DZ10 /api/v1/start-game Реализован запрос на сервис авторизации для создания нового космического боя.', async function() {
      const token = await testHelper.login(app, userLogin);
      expect(token).toBeDefined();
      const request = supertest(app.getHttpServer());
      const result = await request
            .post('/api/v1/start-game')
            .send({
              userLogins:['Alex', 'Bob']
            })
            .set('Authorization', `Bearer ${token}`);

      expect(result.body.success).toEqual(true);
      gameId = result.body.gameId;
      expect(gameId).toBeDefined();
    });
  });

  describe('Авторизация в игре', function() {
    let gameId;
    it('DZ10 /v1/authorize-in-game /api/v1/interpret-command Аутентифицированный пользоавтель авторизовывается в игре и Реализована проверка jwt во входящем сообщении на Игровом сервере', async function() {
      // Alex аутентифицируется в системе
      const tokenAlex = await testHelper.login(app, userLogin);
      expect(tokenAlex).toBeDefined();
      // Alex запускает игру для 'Alex', 'Bob'
      const resultStartGame = await supertest(app.getHttpServer())
            .post('/api/v1/start-game')
            .send({
              userLogins:['Alex', 'Bob']
            })
            .set('Authorization', `Bearer ${tokenAlex}`);

      expect(resultStartGame.body.success).toEqual(true);
      gameId = resultStartGame.body.gameId;
      expect(gameId).toBeDefined();

      // Bob аутентифицируется в системе
      const userLoginBob = {
        "login": "Bob",
        "password": "bob$secret_password"
      }
      const tokenBob = await testHelper.login(app, userLoginBob);
      expect(tokenBob).toBeDefined();

      // Bob авторизуется в игре
      const resultAuthorizeInGameBob = await supertest(app.getHttpServer())
      .post('/api/v1/authorize-in-game')
      .send({
        gameId
      })
      .set('Authorization', `Bearer ${tokenBob}`);
      
      expect(resultAuthorizeInGameBob.body.success).toEqual(true);
      const token = resultAuthorizeInGameBob.body.token;
      expect(token).toBeDefined();

      const resultInterpretCommand= await supertest(app.getHttpServer())
      .post('/api/v1/interpret-command')
      .send({
        idGame: gameId,
        idObject:'myobject',
        idCommand:'FlexibleCommand',
        args: {
          a: 'aaa',
          b: 'bbb',
        }
      })
      .set('Authorization', `Bearer ${token}`);
      
      expect(resultInterpretCommand.body).toBeDefined();

    });
  });

  
});
