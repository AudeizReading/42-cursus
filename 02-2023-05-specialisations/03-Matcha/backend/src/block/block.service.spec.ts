import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from './block.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('BlockService', () => {
	let service: BlockService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [BlockService],
		}).compile();

		service = module.get<BlockService>(BlockService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
