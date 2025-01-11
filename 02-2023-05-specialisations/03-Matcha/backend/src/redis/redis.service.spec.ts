import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { ADatabase } from '$app/database/ADatabase';

const mockRedisClient = {
	get: jest.fn().mockResolvedValue(null),
	set: jest.fn(),
	del: jest.fn(),
	quit: jest.fn().mockResolvedValue(undefined),
};

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('RedisService', () => {
	let service: RedisService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
			],
			providers: [
				{
					provide: 'REDIS_CLIENT',
					useValue: mockRedisClient,
				},
				RedisService,
			],
		}).compile();

		service = module.get<RedisService>(RedisService);
	});

	afterEach(async () => {
		if (service.redisClient) await service.redisClient.quit();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
