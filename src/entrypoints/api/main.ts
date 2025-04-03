import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';

import { AppModule } from './app/app.module';
import { InitCommand } from '../../core/scopes/init-command';
import { IoC } from '../../core/ioc/ioc';
import { FlexibleCommand } from '../../core/flexible-command';
import { ICommand } from '../../core/interfaces/icommand';
import { FindObjectCommand } from '../../core/find-object-command';
import { InterpretCommand } from '../../core/interpret-command';
import { KeepProcessingCommand } from '../../core/keep-processing-command';
import { ProcessingQueueCommand } from '../../core/threads/processing-queue-command';

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

  await (new InitCommand()).execute();
  await IoC.Resolve<ICommand>('IoC.Register', 'FlexibleCommand', (...args) => {
    return new FlexibleCommand(args);
  }).execute();
  await IoC.Resolve<ICommand>('IoC.Register', 'ProcessingQueueCommand', (...args) => {
    const cmd = new ProcessingQueueCommand(args[0]);
    return cmd;
  }).execute();
  await IoC.Resolve<ICommand>('IoC.Register', 'FindObjectCommand', (...args) => {
    return new FindObjectCommand(args[0]);
  }).execute();

  await IoC.Resolve<ICommand>('IoC.Register', 'InterpretCommand', (...args) => {
    return new InterpretCommand(args[0]);
  }).execute();

  const objects = new Map();
  objects.set('myobject1', { id:'myobject1', name:'myname1' });
  objects.set('myobject2', { id:'myobject2', name:'myname2' });
  objects.set('myobject', { id:'myobject', name:'myname' });

  const gameProcessing = await IoC.Resolve<ICommand>('ProcessingQueueCommand', { gameName: 'mygame', objects });
  const commands = gameProcessing.getCommands();
  const keepProcessingCommand = new KeepProcessingCommand({ 
    commands: commands,
    delayMilliseconds: 1000,
  });
  gameProcessing.push(keepProcessingCommand);      
  gameProcessing.execute();
}
bootstrap();
