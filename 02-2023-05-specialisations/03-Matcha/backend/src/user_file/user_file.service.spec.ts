import { Test, TestingModule } from '@nestjs/testing';
import { UserFileService } from '$user_file/user_file.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('UserFileService', () => {
	let service: UserFileService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserFileService],
		}).compile();

		service = module.get<UserFileService>(UserFileService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
