import {
	Inject,
	Injectable,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import moment from 'moment';

import { LoggerService } from '../../logger/logger.service';
import { SERVICE_CRON_TASKS } from '../../constants';

@Injectable()
export class CronDefaultService {
	private readonly runningJobs = new Map<string, boolean>();

	constructor(
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly loggerService: LoggerService,
		@Inject(SERVICE_CRON_TASKS)
		private readonly cronJobs: Array<{ name: string; cronExpression: string; callback: () => Promise<void> }>,
	) {
		this.setup();
	}

	private setup() {
		const TIMESTAMP_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ z';
		this.cronJobs.forEach((job) => {
			const cronJob: CronJob = new CronJob(job.cronExpression, async () => {
				if (this.runningJobs.get(job.name)) {
					this.loggerService.warn(`Задача "${job.name}" уже выполняется, новый запуск пропущен.`);
					return;
				}

				this.runningJobs.set(job.name, true);
				const start = moment().utc().format(TIMESTAMP_FORMAT);
				try {
					this.loggerService.log(`Задача "${job.name}" стартовала в ${start}`);
					await job.callback();
					const end = moment().utc().format(TIMESTAMP_FORMAT);
					// eslint-disable-next-line max-len
					this.loggerService.log(`Задача ${job.name} стартовала в ${start} завершилась успешно в ${end}`);
				} catch (error) {
					this.loggerService.error(`Ошибка при выполнении задачи "${job.name}" Error: ${error}`);
				} finally {
					this.runningJobs.set(job.name, false);
				}
			});

			this.schedulerRegistry.addCronJob(job.name, cronJob);
			cronJob.start();
			// eslint-disable-next-line max-len
			this.loggerService.log(`Добавлена крон-задача "${job.name}" с выражением "${job.cronExpression}"`);
		});
	}
}
