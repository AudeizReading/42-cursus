import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('ReportService', () => {
	let service: ReportService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [ReportService],
		}).compile();

		service = module.get<ReportService>(ReportService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
