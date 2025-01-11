import { Test, TestingModule } from '@nestjs/testing';
import { FameRatingService } from './fame-rating.service';

describe('FameRatingService', () => {
	let service: FameRatingService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [FameRatingService],
		}).compile();

		service = module.get<FameRatingService>(FameRatingService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
