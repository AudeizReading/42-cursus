import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '$config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '$app/user/user.module';
import { EventService } from './event.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('EventController', () => {
	let controller: EventController;

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
			controllers: [EventController],
			providers: [EventService],
		}).compile();

		controller = module.get<EventController>(EventController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
