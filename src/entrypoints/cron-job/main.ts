import { NestFactory } from '@nestjs/core';

import { version } from '../../../package.json';
import { PORT } from '../../constants/env';
import { LoggerService } from '../../logger/logger.service';

import { CronModule } from './cron-job.module';

async function bootstrap() {
	const app = await NestFactory.create(CronModule, {
		bufferLogs: true,
	});

	const logger = await app.resolve(LoggerService);

	try {
		app.useLogger(logger);

		const port = PORT || 8080;
		await app.listen(port);

		logger.log(`🚀 Service is running on port ${port}`);
		logger.log(`Service version: ${version}`);
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`Bootstrap error: ${error.message}`);
		}
		process.exit(1);
	}
}

bootstrap();
