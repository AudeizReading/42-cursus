import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { RedisModule } from '$app/redis/redis.module';
import { RedisService } from '$app/redis/redis.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('LocationService', () => {
	let service: LocationService;
	let redisService: RedisService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				RedisModule,
			],
			providers: [LocationService, Logger],
		}).compile();

		service = module.get<LocationService>(LocationService);
		redisService = module.get<RedisService>(RedisService);
	});

	afterEach(async () => {
		if (redisService.redisClient) await redisService.redisClient.quit();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
