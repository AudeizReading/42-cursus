import { Test, TestingModule } from '@nestjs/testing';
import { OauthService } from './oauth.service';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ADatabase } from '$app/database/ADatabase';

jest.mock('$notification/notification-event.service');
jest.mock('$user/fame-rating.service');

describe('OauthService', () => {
	let service: OauthService;

	beforeEach(async () => {
		await ADatabase.initialize();
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [OauthService, Logger],
		}).compile();

		service = module.get<OauthService>(OauthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
