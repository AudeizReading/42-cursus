import { Test, TestingModule } from '@nestjs/testing';
import { LocationFakeService } from './locationFake.service';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('LocationFakeService', () => {
	let service: LocationFakeService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [LocationFakeService, Logger],
		}).compile();

		service = module.get<LocationFakeService>(LocationFakeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
