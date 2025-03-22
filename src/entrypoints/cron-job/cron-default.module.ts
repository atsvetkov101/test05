import { Module } from '@nestjs/common';

import { SERVICE_CRON_TASKS } from '../../constants';
import { LoggerModule } from '../../logger/logger.module';

import { CronDefaultService } from './cron-default.service';

@Module({
	imports: [
		LoggerModule,
	],
	providers: [
		CronDefaultService,
		{
			provide: SERVICE_CRON_TASKS, useValue: [],
		},
	],
	exports: [CronDefaultService],
})
export class CronDefaultModule {}
