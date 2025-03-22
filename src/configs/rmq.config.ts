import {
	RmqOptions,
	Transport,
} from '@nestjs/microservices';

import { SERVICE_RMQ } from '../constants';
import { AMQP_QUEUE, AMQP_URL } from '../constants/env';

import { RmgMessageSerialize } from './rmg-message.serialize';

export const getRMQConfig = () => ({
	name: SERVICE_RMQ,
	useFactory: (): RmqOptions => ({
		transport: Transport.RMQ,
		options: {
			urls: [AMQP_URL],
			queue: AMQP_QUEUE,
			persistent: true,
			serializer: new RmgMessageSerialize(),
			queueOptions: {
				durable: true,
			},
		},
	}),
});
