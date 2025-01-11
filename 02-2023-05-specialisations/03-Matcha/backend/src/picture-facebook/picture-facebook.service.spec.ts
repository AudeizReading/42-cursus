import { Test, TestingModule } from '@nestjs/testing';
import { PictureFacebookService } from './picture-facebook.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('PictureFacebookService', () => {
	let service: PictureFacebookService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [PictureFacebookService],
		}).compile();
		service = module.get<PictureFacebookService>(PictureFacebookService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
