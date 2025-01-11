import { Test, TestingModule } from '@nestjs/testing';
import { NotificationEventService } from './notification-event.service';
import { ADatabase } from '$app/database/ADatabase';

describe('NotificationEventService', () => {
	let service: NotificationEventService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [NotificationEventService],
		}).compile();

		service = module.get<NotificationEventService>(
			NotificationEventService,
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
