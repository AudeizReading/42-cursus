import { Test, TestingModule } from '@nestjs/testing';
import { LocationIPService } from './locationIp.service';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('LocationIPService', () => {
	let service: LocationIPService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [LocationIPService, Logger],
		}).compile();

		service = module.get<LocationIPService>(LocationIPService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
