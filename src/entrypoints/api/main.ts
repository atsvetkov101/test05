import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';

import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const logger = await app.resolve(LoggerService);

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
}
bootstrap();
