import { Test, TestingModule } from '@nestjs/testing';
import { BrowsingController } from './browsing.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$app/user/user.module';
import { BrowsingService } from './browsing.service';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('BrowsingController', () => {
	let controller: BrowsingController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [configuration],
				}),
				JwtModule,
				UserModule,
			],
			controllers: [BrowsingController],
			providers: [BrowsingService, Logger],
		}).compile();

		controller = module.get<BrowsingController>(BrowsingController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
