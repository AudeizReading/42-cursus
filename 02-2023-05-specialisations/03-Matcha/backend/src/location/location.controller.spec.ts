import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$app/user/user.module';
import { LocationFakeService } from './locationFake.service';
import { LocationNavigatorService } from './locationNavigator.service';
import { LocationIPService } from './locationIp.service';
import { LocationService } from './location.service';
import { Logger } from '@nestjs/common';
import { RedisModule } from '$app/redis/redis.module';
import { RedisService } from '$app/redis/redis.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('LocationController', () => {
	let controller: LocationController;
	let redisService: RedisService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				JwtModule,
				UserModule,
				RedisModule,
			],
			controllers: [LocationController],
			providers: [
				LocationFakeService,
				LocationNavigatorService,
				LocationIPService,
				LocationService,
				Logger,
			],
		}).compile();

		controller = module.get<LocationController>(LocationController);
		redisService = module.get<RedisService>(RedisService);
	});

	afterEach(async () => {
		if (redisService.redisClient) await redisService.redisClient.quit();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
