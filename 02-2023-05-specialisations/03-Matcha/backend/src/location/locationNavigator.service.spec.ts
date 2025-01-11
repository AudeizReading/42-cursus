import { Test, TestingModule } from '@nestjs/testing';
import { LocationNavigatorService } from './locationNavigator.service';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('LocationNavigatorService', () => {
	let service: LocationNavigatorService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			providers: [LocationNavigatorService, Logger],
		}).compile();

		service = module.get<LocationNavigatorService>(
			LocationNavigatorService,
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
