import { Test, TestingModule } from '@nestjs/testing';
import { BrowsingService } from './browsing.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('BrowsingService', () => {
	let service: BrowsingService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [BrowsingService],
		}).compile();

		service = module.get<BrowsingService>(BrowsingService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
