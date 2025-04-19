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

const JWT_SECRET = 'JWT_SECRET';

describe('ApiLogin', () => {
  let app: TestingModule;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [LoggerModule,
        JwtModule.register({
          global: true,
          secret: JWT_SECRET,
        }),
      ],
      controllers: [AppController],
      providers: [AppService, AuthService, AppUsecases, GameUsecases, GameProcessingUsecases],
    }).compile();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  describe('Набор тестов для метода login', function() {
    it('DZ10 Реализована аутентификация с помощью jwt. успешный login. получение jwt-токена', async function() {
      const appController = app.get(AppController);
      const result = await appController.login({"login": "Alex","password": "alex$secret_password"});
      expect(result).toBeDefined();
      expect(result.success).toEqual(true);
      expect(result.token).toBeDefined();
    });
    it('DZ10 Реализована аутентификация с помощью jwt. неуспешный login при передаче ошибочного пароля', async function() {
      const appController = app.get(AppController);
      const result = await appController.login({"login": "Alex","password": "wrong_password"});
      expect(result).toBeDefined();
      expect(result.success).toEqual(false);
    });
  });
});
