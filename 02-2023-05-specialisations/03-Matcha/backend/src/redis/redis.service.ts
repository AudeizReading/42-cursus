import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
	constructor(@Inject('REDIS_CLIENT') public readonly redisClient: Redis) {}

	async getKeys(pattern: string): Promise<string[]> {
		return await this.redisClient.keys(pattern);
	}

	async setValue(key: string, value: string): Promise<void> {
		await this.redisClient.set(key, value);
	}

	async getValue(key: string): Promise<string | null> {
		return await this.redisClient.get(key);
	}
}
