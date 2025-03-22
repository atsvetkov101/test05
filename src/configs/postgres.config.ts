import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';

import {
	DATABASE_URL,
	SEQ_LOG_QUERY_PARAMETERS,
	SEQ_LOGGING,
	SEQ_SSL_ENABLED,
} from '../constants/env';

export const getPostgresConfig = (): SequelizeModuleAsyncOptions => ({
	useFactory: () => ({
		dialect: 'postgres',
		uri: DATABASE_URL,
		autoLoadModels: true, // чтоб не перечислять все модели models: [...],
		logging: SEQ_LOGGING,
		logQueryParameters: SEQ_LOG_QUERY_PARAMETERS,
		synchronize: false, // не пытаться по моделям создавать отсутствующие таблицы в БД
		protocol: 'postgres',
		dialectOptions: {
			ssl: (SEQ_SSL_ENABLED) ? {
				require: true,
				rejectUnauthorized: false,
			} : undefined,
		},
	}),
});
