import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('LikeService', () => {
	let service: LikeService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [LikeService],
		}).compile();

		service = module.get<LikeService>(LikeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
