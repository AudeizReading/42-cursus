import { Test, TestingModule } from '@nestjs/testing';
import { BiographyService } from './biography.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('BiographyService', () => {
	let service: BiographyService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [BiographyService],
		}).compile();

		service = module.get<BiographyService>(BiographyService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
