import { Module } from '@nestjs/common';

import { LoggerModule } from '../../../logger/logger.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [LoggerModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
