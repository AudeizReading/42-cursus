import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('ChatService', () => {
	let service: ChatService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [ChatService],
		}).compile();

		service = module.get<ChatService>(ChatService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
