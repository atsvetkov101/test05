export const LISTEN_PORT: number = Number(process.env.LISTEN_PORT) || 3000;

export const { DATABASE_URL } = process.env;
export const SEQ_LOGGING = process.env.SEQ_LOGGING === 'true';
export const SEQ_LOG_QUERY_PARAMETERS = process.env.SEQ_LOG_QUERY_PARAMETERS === 'true';
export const SEQ_SSL_ENABLED = process.env.SEQ_SSL_ENABLED === 'true';

export const { AMQP_QUEUE } = process.env;
export const AMQP_URL = process.env.AMQP_URL || 'localhost';
export const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '* * * * *';
export const { PORT } = process.env;
