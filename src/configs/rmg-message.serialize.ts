import {
	RmqRecord,
	Serializer,
} from '@nestjs/microservices';

export class RmgMessageSerialize implements Serializer {
	serialize(value: RmqRecord): Record<string, any> {
		if (value && typeof value === 'object' && 'pattern' in value) {
			const messageData: RmqRecord = value.data;
			return messageData.data;
		}
		return value;
	}
}
