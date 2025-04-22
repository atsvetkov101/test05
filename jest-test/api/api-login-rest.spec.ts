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
import { INestApplication } from '@nestjs/common';
import { testHelper } from './test-helper';

const JWT_SECRET = 'JWT_SECRET';
const userLogin = {
  "login": "Alex",
  "password": "alex$secret_password"
}


describe('ApiLogin ендпоинт', () => {
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

  describe('Набор тестов для метода login', function() {
    it(`DZ10 /api/v1/login Реализована аутентификация с помощью jwt. успешный login. получение jwt-токена`, async () => {
      const token = await testHelper.login(app, userLogin);
      expect(token).toBeDefined();
    });
    it(`DZ10 /api/v1/login Реализована аутентификация с помощью jwt. неуспешный login при передаче ошибочного пароля`, async () => {
      let error;
      let token;
      try { 
        token = await testHelper.login(app, {"login": "Alex","password": "wrong_password"});
      } catch(e) {
        error = e;
      }
      expect(token).toBeUndefined();
    });
  });
});
