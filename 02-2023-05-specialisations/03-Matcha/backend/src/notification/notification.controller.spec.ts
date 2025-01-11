import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { UserModule } from '$app/user/user.module';
import { NotificationService } from './notification.service';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('NotificationController', () => {
	let controller: NotificationController;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule,
				ConfigModule.forRoot({
					load: [configuration],
				}),
				UserModule,
			],
			controllers: [NotificationController],
			providers: [NotificationService, Logger],
		}).compile();

		controller = module.get<NotificationController>(NotificationController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
