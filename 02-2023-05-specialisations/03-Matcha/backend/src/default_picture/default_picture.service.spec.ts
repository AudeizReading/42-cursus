import { Test, TestingModule } from '@nestjs/testing';
import { DefaultPictureService } from './default_picture.service';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('DefaultPictureService', () => {
	let service: DefaultPictureService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [DefaultPictureService],
		}).compile();

		service = module.get<DefaultPictureService>(DefaultPictureService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
