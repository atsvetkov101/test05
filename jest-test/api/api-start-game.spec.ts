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

const JWT_SECRET = 'JWT_SECRET';

const sleep = (timeout_ms) => new Promise((resolve) => setTimeout(resolve, timeout_ms));

describe('ApiLogin', () => {
  let token;
  let app: TestingModule;
  let appController;
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
    appController = app.get(AppController);
    const result = await appController.login({"login": "Alex","password": "alex$secret_password"});
    expect(result).toBeDefined();
    expect(result.success).toEqual(true);
    expect(result.token).toBeDefined();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  describe('Создание нового космического боя', function() {
    let gameId;
    it('DZ10 Реализован запрос на сервис авторизации для создания нового космического боя.', async function() {
      const gameProcessingUsecases = app.get(GameProcessingUsecases);
      const result = await gameProcessingUsecases.startNewGameByUser(["Alex", "Bob"]);
      expect(result).toBeDefined();
      gameId = result;
    });
  });
});
