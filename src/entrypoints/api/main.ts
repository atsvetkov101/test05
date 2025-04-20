import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import httpContext from 'express-http-context';

import { LoggerService } from '../../logger/logger.service';

import { AppModule } from './app/app.module';
import { GameProcessingUsecases } from './game/game-processing.usecases';
import { getHttpContextConfig } from '../../configs/http-context.config';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const logger = await app.resolve(LoggerService);
  try {
    const gameProcessing = await app.resolve(GameProcessingUsecases);

    app.use(httpContext.middleware);
    
    app.use(getHttpContextConfig());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    const port = 3000;
    await app.listen(port);
    
    logger.log(`Listening on http://localhost:${port}`);

    // await gameProcessing.startGame('mygame');
    await gameProcessing.startGames(['mygame1', 'mygame2']);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Bootstrap error: ${error.message}`);
    }
    process.exit(1);
  }
}
bootstrap();
