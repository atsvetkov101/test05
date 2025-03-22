import {
	Injectable,
} from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class HelloWorldUsecases {
	constructor(
		private readonly loggerService: LoggerService,
	) {}

	async helloWorld(): Promise<void> {
		this.loggerService.log('Hello World!');
	}
}
