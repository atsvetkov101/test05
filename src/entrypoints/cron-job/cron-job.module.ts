import { Module } from '@nestjs/common';
import {
	ScheduleModule,
	SchedulerRegistry,
} from '@nestjs/schedule';

import { CRON_SCHEDULE } from '../../constants/env';
import { LoggerService } from '../../logger/logger.service';
import { LoggerModule } from '../../logger/logger.module';
import { CRON_JOB_NAME } from '../../constants';

import { HelloWorldUsecases } from './cron-job.usecases';
import { CronDefaultService } from './cron-default.service';
import { CronDefaultModule } from './cron-default.module';

@Module({
	imports: [
		CronDefaultModule,
		ScheduleModule.forRoot(),
		LoggerModule,
	],
	providers: [
		HelloWorldUsecases,
		{
			provide: 'CronHandlerFactory',
			useFactory: (
				schedulerRegistry: SchedulerRegistry,
				loggerService: LoggerService,
				usecases: HelloWorldUsecases,
			) => new CronDefaultService(schedulerRegistry, loggerService, [
				{
					name: CRON_JOB_NAME.toLowerCase(),
					cronExpression: CRON_SCHEDULE,
					callback: usecases.helloWorld.bind(usecases),
				},
			]),
			inject: [SchedulerRegistry, LoggerService, HelloWorldUsecases],
		},
	],
})
export class CronModule {}
