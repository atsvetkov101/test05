import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerModule } from '../../../logger/logger.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from '../auth/auth.service';
import { AuthenticationMiddleware } from '../auth/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AppUsecases } from './app.usecases';
import { GameUsecases } from '../game/game.usecases';
import { GameProcessingUsecases } from '../game/game-processing.usecases';
const EXCLUDED_ROUTES = [
	'/api/v1/login', '/api/v1/hello-world'
];

const JWT_SECRET = process.env.JWT_SECRET || 'default;.super!@321SECRET$$';

@Module({
	imports: [LoggerModule,
    JwtModule.register({
			global: true,
			secret: JWT_SECRET,
		}),
  ],
	controllers: [AppController],
	providers: [AppService, AuthService, AppUsecases, GameUsecases, GameProcessingUsecases],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
			.apply(AuthenticationMiddleware)
			.exclude(...EXCLUDED_ROUTES)
			.forRoutes('api/*');
  }
}
