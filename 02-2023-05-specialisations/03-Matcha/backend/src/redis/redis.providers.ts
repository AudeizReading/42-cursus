import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisProvider = {
	provide: 'REDIS_CLIENT',
	useFactory: (configService: ConfigService): Redis => {
		return new Redis({
			host: configService.get<string>('redis.host'),
			port: configService.get<number>('redis.port'),
			password: configService.get<string>('redis.password'),
		});
	},
	inject: [ConfigService],
};
