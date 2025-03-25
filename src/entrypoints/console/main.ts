import readline from 'node:readline';

import { NestFactory } from '@nestjs/core';

import { version } from '../../../package.json';
import { LoggerService } from '../../logger/logger.service';

import { ConsoleModule } from './console.module';
import { ConsoleService } from './console.service';

async function bootstrap() {
	const app = await NestFactory.create(ConsoleModule, {
		bufferLogs: true,
	});

	const logger = await app.resolve(LoggerService);

	try {
		app.useLogger(logger);

		logger.log(`Service version: ${version}`);
		const consoleService = await app.resolve(ConsoleService);
    await consoleService.startProcessing();
    /*
		const greeting = consoleService.getHello();
    logger.log(greeting);
*/
    const port = 8080;
    await app.listen(port);
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`Bootstrap error: ${error.message}`);
		}
		process.exit(1);
	}
}

bootstrap();
