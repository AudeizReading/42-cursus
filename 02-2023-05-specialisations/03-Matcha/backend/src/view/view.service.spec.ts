import { Test, TestingModule } from '@nestjs/testing';
import { ViewService } from './view.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('ViewService', () => {
	let service: ViewService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [ViewService],
		}).compile();

		service = module.get<ViewService>(ViewService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
