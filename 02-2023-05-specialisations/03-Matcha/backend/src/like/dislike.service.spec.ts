import { Test, TestingModule } from '@nestjs/testing';
import { DislikeService } from './dislike.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('DislikeService', () => {
	let service: DislikeService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [DislikeService],
		}).compile();

		service = module.get<DislikeService>(DislikeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
