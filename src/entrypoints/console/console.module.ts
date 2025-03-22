import { Module } from '@nestjs/common';

import { LoggerModule } from '../../logger/logger.module';

import { ConsoleController } from './console.controller';
import { ConsoleService } from './console.service';

@Module({
	imports: [LoggerModule],
	controllers: [ConsoleController],
	providers: [ConsoleService],
})
export class ConsoleModule {}
