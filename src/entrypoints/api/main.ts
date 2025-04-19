import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';

import { AppModule } from './app/app.module';
import { GameProcessingUsecases } from './game/game-processing.usecases';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const logger = await app.resolve(LoggerService);
  const gameProcessing = await app.resolve(GameProcessingUsecases);

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
}
bootstrap();
