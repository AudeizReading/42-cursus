import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('EventService', () => {
	let service: EventService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [EventService],
		}).compile();

		service = module.get<EventService>(EventService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
