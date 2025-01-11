import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from './db.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('DbService', () => {
	let service: DbService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [DbService],
		}).compile();
		service = module.get<DbService>(DbService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
